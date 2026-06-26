import { db } from "@workspace/db";
import { fixturesTable, resultsTable, leagueTableTable } from "@workspace/db";
import { and, gte, lte } from "drizzle-orm";

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE = "https://v3.football.api-sports.io";
const PSL_LEAGUE_ID = 288;
const TEAM_ID = 6316;

async function apiFetch(path: string) {
  if (!API_KEY) throw new Error("FOOTBALL_API_KEY not set");
  const res = await fetch(`${BASE}${path}`, {
    headers: { "x-apisports-key": API_KEY },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export async function getLatestAccessibleSeason(): Promise<number> {
  const currentYear = new Date().getFullYear();
  for (const year of [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]) {
    try {
      const data = await apiFetch(`/standings?league=${PSL_LEAGUE_ID}&season=${year}`);
      if (data.response?.[0]?.league?.standings?.[0]?.length > 0) return year;
    } catch { /* try next */ }
  }
  return currentYear - 1;
}

/** Season year X = Aug X to Jun X+1. Returns date range as YYYY-MM-DD strings. */
function seasonDateRange(year: number): { from: string; to: string } {
  return {
    from: `${year}-07-01`,
    to: `${year + 1}-06-30`,
  };
}

export async function runSyncFixtures() {
  if (!API_KEY) throw new Error("FOOTBALL_API_KEY not set");
  const season = await getLatestAccessibleSeason();
  const data = await apiFetch(`/fixtures?league=${PSL_LEAGUE_ID}&team=${TEAM_ID}&season=${season}&status=NS`);
  const fixtures = data.response as Array<{
    fixture: { date: string; venue: { name: string }; status: { short: string } };
    teams: { home: { name: string }; away: { name: string } };
    league: { name: string };
  }>;

  let upserted = 0;
  for (const f of fixtures) {
    const dt = new Date(f.fixture.date);
    const date = dt.toISOString().slice(0, 10);
    const time = dt.toTimeString().slice(0, 5);
    await db.insert(fixturesTable).values({
      date, time,
      homeTeam: f.teams.home.name,
      awayTeam: f.teams.away.name,
      venue: f.fixture.venue?.name ?? "TBC",
      competition: f.league.name,
      completed: false,
    }).onConflictDoNothing();
    upserted++;
  }
  return { synced: upserted, total: fixtures.length, season, note: fixtures.length === 0 ? "No upcoming fixtures found — the free API plan only covers completed seasons." : undefined };
}

export async function runSyncResults() {
  if (!API_KEY) throw new Error("FOOTBALL_API_KEY not set");
  const season = await getLatestAccessibleSeason();
  const data = await apiFetch(`/fixtures?league=${PSL_LEAGUE_ID}&team=${TEAM_ID}&season=${season}&status=FT`);
  const matches = data.response as Array<{
    fixture: { date: string; venue: { name: string } };
    teams: { home: { name: string }; away: { name: string } };
    goals: { home: number; away: number };
    league: { name: string };
  }>;

  const { from, to } = seasonDateRange(season);

  // Only clear and replace if the API actually returned results (guard against empty free-plan response)
  if (matches.length > 0) {
    await db.delete(resultsTable).where(
      and(
        gte(resultsTable.date, from),
        lte(resultsTable.date, to)
      )
    );
  }

  let inserted = 0;
  for (const m of matches) {
    const date = new Date(m.fixture.date).toISOString().slice(0, 10);
    await db.insert(resultsTable).values({
      date,
      homeTeam: m.teams.home.name,
      awayTeam: m.teams.away.name,
      homeScore: m.goals.home ?? 0,
      awayScore: m.goals.away ?? 0,
      competition: m.league.name,
      venue: m.fixture.venue?.name ?? null,
      scorers: [],
    });
    inserted++;
  }
  return { synced: inserted, total: matches.length, season };
}

export async function runSyncTable() {
  if (!API_KEY) throw new Error("FOOTBALL_API_KEY not set");
  const season = await getLatestAccessibleSeason();
  const data = await apiFetch(`/standings?league=${PSL_LEAGUE_ID}&season=${season}`);
  const standings = data.response?.[0]?.league?.standings?.[0] as Array<{
    rank: number; team: { name: string };
    all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
    goalsDiff: number; points: number;
  }>;

  if (!standings?.length) throw new Error("No standings found for this season");

  await db.delete(leagueTableTable);
  await db.insert(leagueTableTable).values(
    standings.map(s => ({
      season,
      position: s.rank,
      team: s.team.name,
      played: s.all.played,
      won: s.all.win,
      drawn: s.all.draw,
      lost: s.all.lose,
      goalsFor: s.all.goals.for,
      goalsAgainst: s.all.goals.against,
      goalDifference: s.goalsDiff,
      points: s.points,
      isGoldenArrows: s.team.name.toLowerCase().includes("golden arrows"),
      logoUrl: null,
    }))
  );
  return { synced: standings.length, total: standings.length, season };
}

const SCOREAXIS_WIDGET_URL =
  "https://widgets.scoreaxis.com/api/football/league-table/623219f2b96de7637f51d75e" +
  "?widgetId=cdv9mqvfg7kc&lang=en&teamLogo=1&tableLines=1&homeAway=0&header=1" +
  "&position=1&goals=1&gamesCount=1&diff=1&winCount=1&drawCount=1&loseCount=1" +
  "&lastGames=1&points=1&teamsLimit=all&links=0";

const SCOREAXIS_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://www.scoreaxis.com/",
};

function parseScoreAxisWidget(raw: string): Array<{
  position: number; team: string; logoUrl: string | null;
  played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDifference: number; points: number;
}> {
  const decoded = raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\\//g, "/")
    .replace(/\\"/g, '"');

  const positions = [...decoded.matchAll(/class="num-item fl_c_c[^"]*"[^>]*>\s*(\d+)/g)];
  const names = [...decoded.matchAll(/title="([^"]+)"\s+class="text-overflow"/g)];
  const logos = [...decoded.matchAll(/src="(https:\/\/statistic-cdn\.scoreaxis\.com\/team\/[^"]+)"/g)];
  const rows = [...decoded.matchAll(
    /<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)\s*:\s*(\d+)<\/td>\s*<td[^>]*>([-\d]+)<\/td>\s*<td[^>]*class="points">(\d+)<\/td>/g
  )];

  const PSL_TEAM_COUNT = 16;
  const count = Math.min(positions.length, names.length, rows.length, PSL_TEAM_COUNT);
  const teams = [];

  for (let i = 0; i < count; i++) {
    const logoRaw = logos[i] ? logos[i][1] : null;
    const logoUrl = logoRaw ? logoRaw.replace(/-30-30\.(png|jpg|webp)$/, "-60-60.png") : null;
    teams.push({
      position: parseInt(positions[i][1]),
      team: names[i][1],
      logoUrl,
      played: parseInt(rows[i][1]),
      won: parseInt(rows[i][2]),
      drawn: parseInt(rows[i][3]),
      lost: parseInt(rows[i][4]),
      goalsFor: parseInt(rows[i][5]),
      goalsAgainst: parseInt(rows[i][6]),
      goalDifference: parseInt(rows[i][7]),
      points: parseInt(rows[i][8]),
    });
  }
  return teams;
}

export async function runSyncScoreAxisTable(): Promise<{ synced: number; source: string }> {
  const res = await fetch(SCOREAXIS_WIDGET_URL, { headers: SCOREAXIS_HEADERS });
  if (!res.ok) throw new Error(`ScoreAxis fetch failed: ${res.status}`);
  const raw = await res.text();

  const teams = parseScoreAxisWidget(raw);
  if (teams.length === 0) throw new Error("ScoreAxis: no team data found in widget response");

  const season = 2025;
  await db.delete(leagueTableTable);
  await db.insert(leagueTableTable).values(
    teams.map(t => ({
      season,
      position: t.position,
      team: t.team,
      logoUrl: t.logoUrl,
      played: t.played,
      won: t.won,
      drawn: t.drawn,
      lost: t.lost,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      goalDifference: t.goalDifference,
      points: t.points,
      isGoldenArrows: t.team.toLowerCase().includes("golden arrows"),
    }))
  );
  return { synced: teams.length, source: "scoreaxis" };
}
