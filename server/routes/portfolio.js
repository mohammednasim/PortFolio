import { Router } from "express";
import { portfolio } from "../../src/data/portfolio.js";

const router = Router();

// Content is static per deploy, so let browsers/proxies reuse it briefly.
const cache = (seconds) => (req, res, next) => {
  res.set("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=120`);
  next();
};

router.get("/profile", cache(120), (req, res) => {
  const { name, role, email, phone, location, linkedin, github, resume, avatar, summary, identity, availability } =
    portfolio;
  res.json({ name, role, email, phone, location, linkedin, github, resume, avatar, summary, identity, availability });
});

router.get("/portfolio", cache(120), (req, res) => {
  res.json(portfolio);
});

router.get("/projects", cache(120), (req, res) => {
  const { category, featured, q, limit } = req.query;
  let items = portfolio.projects;

  if (category && category !== "all") items = items.filter((p) => p.category === category);
  if (featured === "true") items = items.filter((p) => p.featured);
  if (q) {
    const needle = String(q).toLowerCase();
    items = items.filter((p) =>
      [p.title, p.description, p.categoryLabel, ...p.stack].join(" ").toLowerCase().includes(needle)
    );
  }
  if (limit) items = items.slice(0, Math.max(1, Number(limit)));

  res.json({ total: items.length, categories: portfolio.projectCategories, projects: items });
});

router.get("/projects/:id", cache(120), (req, res) => {
  const project = portfolio.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "not_found", message: "Project not found" });
  res.json(project);
});

router.get("/categories", cache(300), (req, res) => {
  res.json(
    portfolio.projectCategories.map((c) => ({
      ...c,
      count: c.id === "all" ? portfolio.projects.length : portfolio.projects.filter((p) => p.category === c.id).length,
    }))
  );
});

router.get("/skills", cache(300), (req, res) => res.json(portfolio.skills));
router.get("/services", cache(300), (req, res) => res.json(portfolio.services));
router.get("/experience", cache(300), (req, res) => res.json(portfolio.experience));
router.get("/education", cache(300), (req, res) => res.json(portfolio.education));
router.get("/certifications", cache(300), (req, res) => res.json(portfolio.certifications));
router.get("/achievements", cache(300), (req, res) => res.json(portfolio.achievements));

export default router;
