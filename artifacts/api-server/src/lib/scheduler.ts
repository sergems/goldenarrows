import { logger } from "./logger";
import { runSyncFixtures, runSyncResults, runSyncTable } from "./syncJobs";

// SAST = UTC+2. Target times in UTC: 13, 16, 18, 20
// Corresponds to SAST: 15:00, 18:00, 20:00, 22:00
const SYNC_HOURS_UTC = new Set([13, 16, 18, 20]);

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

async function runAllSyncs() {
  const nowSAST = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const hourSAST = nowSAST.getUTCHours();
  logger.info({ hourSAST }, "Scheduled sync starting");

  const results = await Promise.allSettled([
    runSyncFixtures(),
    runSyncResults(),
    runSyncTable(),
  ]);

  const [fixtures, matchResults, table] = results;

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

  if (table.status === "fulfilled") {
    logger.info({ synced: table.value.synced, season: table.value.season }, "Scheduled sync: table done");
  } else {
    logger.warn({ err: table.reason }, "Scheduled sync: table failed");
  }
}

export function startScheduler() {
  if (!process.env.FOOTBALL_API_KEY) {
    logger.warn("FOOTBALL_API_KEY not set — scheduled sync disabled");
    return;
  }

  logger.info(
    { syncTimesUTC: [...SYNC_HOURS_UTC].map(h => `${h}:00`), syncTimesSAST: "15:00, 18:00, 20:00, 22:00" },
    "Scheduled sync enabled"
  );

  let lastFiredHour = -1;

  schedulerInterval = setInterval(() => {
    const now = new Date();
    const hourUTC = now.getUTCHours();
    const minuteUTC = now.getUTCMinutes();

    if (minuteUTC === 0 && SYNC_HOURS_UTC.has(hourUTC) && hourUTC !== lastFiredHour) {
      lastFiredHour = hourUTC;
      runAllSyncs().catch(err => {
        logger.error({ err }, "Scheduled sync encountered an unexpected error");
      });
    }

    if (minuteUTC !== 0 && lastFiredHour === hourUTC) {
      lastFiredHour = -1;
    }
  }, 30_000);
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}
