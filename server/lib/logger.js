const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

function threshold() {
  return LEVELS[process.env.LOG_LEVEL] ?? (process.env.NODE_ENV === "production" ? 20 : 10);
}

function emit(level, message, meta) {
  if (LEVELS[level] < threshold()) return;
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    ...(meta && Object.keys(meta).length ? meta : {}),
  });
  const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
}

export const logger = {
  debug: (message, meta) => emit("debug", message, meta),
  info: (message, meta) => emit("info", message, meta),
  warn: (message, meta) => emit("warn", message, meta),
  error: (message, meta) => emit("error", message, meta),
};

/** Structured access log: method, path, status and latency for every request. */
export function requestLogger(req, res, next) {
  const started = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Math.round(Number(process.hrtime.bigint() - started) / 1e6);
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    logger[level]("http", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms,
    });
  });
  next();
}
