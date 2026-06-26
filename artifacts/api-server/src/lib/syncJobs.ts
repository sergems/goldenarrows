import { db } from "@workspace/db";
import { fixturesTable, resultsTable, leagueTableTable } from "@workspace/db";

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
  for (const year of [2024, 2023, 2022]) {
    try {
      const data = await apiFetch(`/standings?league=${PSL_LEAGUE_ID}&season=${year}`);
      if (data.response?.[0]?.league?.standings?.[0]?.length > 0) return year;
    } catch { /* try next */ }
  }
  return 2024;
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
    }).onConflictDoNothing();
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
