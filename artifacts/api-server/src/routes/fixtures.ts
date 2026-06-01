import { Router } from "express";
import { db } from "@workspace/db";
import { fixturesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { ListFixturesQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/fixtures", async (req, res) => {
  const query = ListFixturesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  let dbQuery = db
    .select()
    .from(fixturesTable)
    .where(eq(fixturesTable.completed, false))
    .orderBy(asc(fixturesTable.date))
    .$dynamic();
  if (query.data.competition) {
    dbQuery = dbQuery.where(eq(fixturesTable.competition, query.data.competition));
  }
  const limit = query.data.limit ?? 20;
  const rows = await dbQuery.limit(Number(limit));
  res.json(rows.map(mapFixture));
});

router.get("/fixtures/next", async (_req, res) => {
  const [row] = await db
    .select()
    .from(fixturesTable)
    .where(eq(fixturesTable.completed, false))
    .orderBy(asc(fixturesTable.date))
    .limit(1);
  if (!row) {
    res.json(null);
    return;
  }
  res.json(mapFixture(row));
});

function mapFixture(row: typeof fixturesTable.$inferSelect) {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    homeTeam: row.homeTeam,
    awayTeam: row.awayTeam,
    competition: row.competition,
    venue: row.venue,
    ticketUrl: row.ticketUrl,
  };
}

export default router;
