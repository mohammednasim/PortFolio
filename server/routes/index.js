import { Router } from "express";
import { aiEnabled, mailerEnabled } from "../config.js";
import { analyticsSummary, recentContacts } from "../db.js";
import { portfolio } from "../../src/data/portfolio.js";
import contactRoutes from "./contact.js";
import analyticsRoutes from "./analytics.js";
import chatRoutes from "./chat.js";
import portfolioRoutes from "./portfolio.js";
import learnRoutes from './learn.js';

const router = Router();

router.get("/", (req, res) => {
  res.json({
    service: "nasim-portfolio-api",
    version: "1.0.0",
    owner: portfolio.name,
    endpoints: [
      "GET  /api/health",
      "GET  /api/portfolio",
      "GET  /api/profile",
      "GET  /api/projects?category=&featured=&q=&limit=",
      "GET  /api/projects/:id",
      "GET  /api/categories",
      "GET  /api/skills",
      "GET  /api/services",
      "GET  /api/experience",
      "GET  /api/education",
      "GET  /api/certifications",
      "GET  /api/achievements",
      "POST /api/contact",
      "GET  /api/contact/:ticket",
      "POST /api/analytics/events",
      "GET  /api/analytics/stats",
      "POST /api/chat",
      "GET  /api/chat/history?sessionId=",
      "GET  /api/chat/suggestions",
      "GET  /api/learn/subjects",
      "POST /api/learn/ask",
    ],
  });
});

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    env: process.env.NODE_ENV || "development",
    features: { mailer: mailerEnabled, assistant: aiEnabled, database: true },
  });
});

// Lightweight public counters used by the hero stats strip.
router.get("/stats/public", (req, res) => {
  const summary = analyticsSummary();
  res.json({
    projects: portfolio.projects.length,
    services: portfolio.services.length,
    certifications: portfolio.certifications.length,
    pageviews: summary.pageviews,
    uniqueVisitors: summary.uniqueVisitors,
  });
});

// Owner-only view of captured leads. Enabled only when ADMIN_TOKEN is set.
router.get("/admin/messages", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  const provided = req.get("x-admin-token") || req.query.token;
  if (!token) return res.status(404).json({ error: "not_found", message: "Admin API disabled" });
  if (provided !== token) return res.status(401).json({ error: "unauthorized", message: "Invalid admin token" });
  res.json({ count: recentContacts(50).length, messages: recentContacts(50) });
});

router.use("/", portfolioRoutes);
router.use("/contact", contactRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/chat", chatRoutes);
router.use("/learn", learnRoutes);

export default router;
