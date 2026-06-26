import { logger } from "./logger";
import { runSyncFixtures, runSyncResults, runSyncScoreAxisTable } from "./syncJobs";

// ─── Schedule config ───────────────────────────────────────────────────────────
//
// ScoreAxis table: every 30 min during the match window (12:00–23:00 SAST = 10:00–21:00 UTC)
// Football API (fixtures + results): 4× per day at 13, 16, 18, 20 UTC (15, 18, 20, 22 SAST)
//
// PSL match kick-off windows (SAST): 15:00, 17:30, 20:00 on weekends; ~20:00 midweek.
// Syncing every 30 min from 12:00–23:00 SAST covers pre-match build-up, live updates,
// and full-time standings well within the first hour of a result.
//
// ──────────────────────────────────────────────────────────────────────────────

const TABLE_SYNC_WINDOW_UTC = { start: 10, end: 21 }; // 12:00–23:00 SAST
const TABLE_SYNC_INTERVAL_MIN = 30;

const FOOTBALL_API_HOURS_UTC = new Set([13, 16, 18, 20]); // fixtures + results

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

async function syncLeagueTable() {
  try {
    const result = await runSyncScoreAxisTable();
    logger.info({ synced: result.synced, source: result.source }, "Scheduled sync: league table done");
  } catch (err) {
    logger.warn({ err }, "Scheduled sync: league table failed");
  }
}

async function syncFootballApi() {
  const fixturesSync = process.env.FOOTBALL_API_KEY
    ? runSyncFixtures()
    : Promise.reject(new Error("FOOTBALL_API_KEY not set"));
  const resultsSync = process.env.FOOTBALL_API_KEY
    ? runSyncResults()
    : Promise.reject(new Error("FOOTBALL_API_KEY not set"));

  const [fixtures, matchResults] = await Promise.allSettled([fixturesSync, resultsSync]);

  if (fixtures.status === "fulfilled") {
    logger.info({ synced: fixtures.value.synced, season: fixtures.value.season }, "Scheduled sync: fixtures done");
  } else {
    logger.warn({ err: fixtures.reason }, "Scheduled sync: fixtures failed");
  }

  if (matchResults.status === "fulfilled") {
    logger.info({ synced: matchResults.value.synced, season: matchResults.value.season }, "Scheduled sync: results done");
  } else {
    logger.warn({ err: matchResults.reason }, "Scheduled sync: results failed");
  }
}

export function startScheduler() {
  logger.info(
    {
      tableSync: `every ${TABLE_SYNC_INTERVAL_MIN} min between ${TABLE_SYNC_WINDOW_UTC.start}:00–${TABLE_SYNC_WINDOW_UTC.end}:00 UTC (12:00–23:00 SAST)`,
      footballApiSync: "13:00, 16:00, 18:00, 20:00 UTC (15:00, 18:00, 20:00, 22:00 SAST)",
    },
    "Scheduler started"
  );

  let lastTableSyncMin = -1;
  let lastFootballApiHour = -1;

  schedulerInterval = setInterval(() => {
    const now = new Date();
    const hourUTC = now.getUTCHours();
    const minUTC = now.getUTCMinutes();
    const totalMinUTC = hourUTC * 60 + minUTC;

    // ── ScoreAxis table: every 30 min inside the match window ──────────────
    const windowStart = TABLE_SYNC_WINDOW_UTC.start * 60;
    const windowEnd = TABLE_SYNC_WINDOW_UTC.end * 60;
    const inWindow = totalMinUTC >= windowStart && totalMinUTC < windowEnd;
    const slotMin = Math.floor(totalMinUTC / TABLE_SYNC_INTERVAL_MIN) * TABLE_SYNC_INTERVAL_MIN;

    if (inWindow && minUTC % TABLE_SYNC_INTERVAL_MIN === 0 && slotMin !== lastTableSyncMin) {
      lastTableSyncMin = slotMin;
      syncLeagueTable().catch(err => logger.error({ err }, "Unexpected error in table sync"));
    }

    // Reset slot tracker outside the window so re-entry fires correctly
    if (!inWindow) lastTableSyncMin = -1;

    // ── Football API: 4× per day at specified UTC hours ────────────────────
    if (minUTC === 0 && FOOTBALL_API_HOURS_UTC.has(hourUTC) && hourUTC !== lastFootballApiHour) {
      lastFootballApiHour = hourUTC;
      syncFootballApi().catch(err => logger.error({ err }, "Unexpected error in Football API sync"));
    }

    if (minUTC !== 0 && lastFootballApiHour === hourUTC) {
      lastFootballApiHour = -1;
    }
  }, 30_000);
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
