import { Router } from "express";
import { db } from "@workspace/db";
import { leagueTableTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router = Router();

router.get("/league/table", async (_req, res) => {
  const rows = await db
    .select()
    .from(leagueTableTable)
    .orderBy(asc(leagueTableTable.position));
  res.json(
    rows.map((row) => ({
      position: row.position,
      team: row.team,
      logoUrl: row.logoUrl,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalDifference,
      points: row.points,
      isGoldenArrows: row.isGoldenArrows,
    }))
  );
});

export default router;
