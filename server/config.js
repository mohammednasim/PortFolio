import "dotenv/config";

const bool = (value, fallback = false) =>
  value == null ? fallback : /^(1|true|yes|on)$/i.test(String(value).trim());

const list = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8787),
  host: process.env.HOST || "0.0.0.0",
  trustProxy: bool(process.env.TRUST_PROXY, false),
  corsOrigins: list(process.env.CORS_ORIGINS),
  dbFile: process.env.DB_FILE || "data/portfolio.db",
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: bool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.CONTACT_FROM || process.env.SMTP_USER || "",
    to: process.env.CONTACT_TO || "",
  },

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS || 25000),
  },
};

export const isProd = config.env === "production";
export const mailerEnabled = Boolean(config.smtp.host && config.smtp.to);
export const aiEnabled = Boolean(config.gemini.apiKey);
