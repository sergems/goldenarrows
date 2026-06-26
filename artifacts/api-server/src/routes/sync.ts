import { Router } from "express";
import { runSyncFixtures, runSyncResults, runSyncTable } from "../lib/syncJobs";

const router = Router();

router.post("/sync/fixtures", async (_req, res) => {
  if (!process.env.FOOTBALL_API_KEY) {
    res.status(503).json({ error: "FOOTBALL_API_KEY environment variable not set." });
    return;
  }
  try {
    const result = await runSyncFixtures();
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Sync failed" });
  }
});

router.post("/sync/results", async (_req, res) => {
  if (!process.env.FOOTBALL_API_KEY) {
    res.status(503).json({ error: "FOOTBALL_API_KEY not set" });
    return;
  }
  try {
    const result = await runSyncResults();
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Sync failed" });
  }
});

router.post("/sync/table", async (_req, res) => {
  if (!process.env.FOOTBALL_API_KEY) {
    res.status(503).json({ error: "FOOTBALL_API_KEY not set" });
    return;
  }
  try {
    const result = await runSyncTable();
    res.json(result);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Sync failed" });
  }
});

export default router;
