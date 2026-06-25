import { Router } from "express";

const router = Router();

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!adminPassword) {
    res.status(500).json({ error: "Admin password not configured" });
    return;
  }

  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  res.json({ ok: true });
});

export default router;
