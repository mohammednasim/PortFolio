import { existsSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { aiEnabled, config, isProd, mailerEnabled } from "./config.js";
import { logger, requestLogger } from "./lib/logger.js";
import apiRoutes from "./routes/index.js";

const app = express();
const distDir = resolve(process.cwd(), "dist");
const hasBuild = existsSync(resolve(distDir, "index.html"));

app.disable("x-powered-by");
if (config.trustProxy) app.set("trust proxy", 1);

app.use(
  helmet({
    // The SPA loads remote AI artwork and three.js runs inline shaders.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(
  cors({
    origin: config.corsOrigins.length
      ? config.corsOrigins
      : [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
    methods: ["GET", "POST", "OPTIONS"],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: "64kb" }));
app.use(requestLogger);

// Coarse global guard; individual routes add their own stricter limits.
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 180,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "rate_limited", message: "Too many requests. Please slow down." },
  })
);

app.use("/api", apiRoutes);

// Unknown API routes must never fall through to the SPA shell.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "not_found", message: `No API route for ${req.method} ${req.originalUrl}` });
});

// Production: serve the built front-end from the same origin.
if (hasBuild) {
  app.use(express.static(distDir, { index: false, maxAge: isProd ? "1h" : 0 }));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    res.sendFile(resolve(distDir, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.type("text/plain").send(
      "Portfolio API is running. The front-end build (dist/) was not found — run `npm run dev` for the dev server " +
        "or `npm run build` to create a production bundle. API root: /api"
    );
  });
}

app.use((req, res) => {
  res.status(404).json({ error: "not_found", message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Central error handler — malformed JSON gets a 400, everything else a 500.
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "invalid_json", message: "Request body is not valid JSON" });
  }

  const status = Number(error?.status) >= 400 && Number(error?.status) < 600 ? Number(error.status) : 500;
  logger.error("request failed", {
    path: req.originalUrl,
    status,
    error: String(error?.message || error),
  });

  res.status(status).json({
    error: status >= 500 ? "server_error" : "request_error",
    message: isProd && status >= 500 ? "Something went wrong. Please try again." : String(error?.message || error),
  });
});

const server = app.listen(config.port, config.host, () => {
  logger.info("portfolio api listening", {
    url: `http://localhost:${config.port}`,
    env: config.env,
    frontend: hasBuild ? "serving dist/" : "dev server separate",
    mailer: mailerEnabled ? "enabled" : "disabled",
    assistant: aiEnabled ? `gemini/${config.gemini.model}` : "local knowledge engine",
  });
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    logger.info("shutting down", { signal });
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  });
}

export default app;
