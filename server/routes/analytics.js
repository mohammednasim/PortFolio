import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { analyticsSummary, trackEvent } from "../db.js";

const schema = z.object({
  type: z.enum(["pageview", "project_view", "resume_download", "outbound_click", "contact_submit"]),
  path: z.string().max(300).optional().default(""),
  ref: z.string().max(300).optional().default(""),
  session: z.string().max(80).optional().default(""),
  label: z.string().max(120).optional().default(""),
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const router = Router();

router.post("/events", limiter, (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "validation_error", message: "Unknown event payload" });
    }
    trackEvent(parsed.data);
    res.status(202).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get("/stats", (req, res, next) => {
  try {
    res.json(analyticsSummary());
  } catch (error) {
    next(error);
  }
});

export default router;
