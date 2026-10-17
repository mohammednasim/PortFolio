import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";

const file = resolve(process.cwd(), config.dbFile);
mkdirSync(dirname(file), { recursive: true });

const db = new DatabaseSync(file);
db.exec("PRAGMA journal_mode = WAL;");
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket     TEXT    NOT NULL UNIQUE,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    subject    TEXT    NOT NULL DEFAULT '',
    message    TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'received',
    ip         TEXT    NOT NULL DEFAULT '',
    user_agent TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT    NOT NULL,
    path       TEXT    NOT NULL DEFAULT '',
    ref        TEXT    NOT NULL DEFAULT '',
    session    TEXT    NOT NULL DEFAULT '',
    label      TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_events_type ON events (type);
  CREATE INDEX IF NOT EXISTS idx_events_created ON events (created_at);

  CREATE TABLE IF NOT EXISTS chat_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session    TEXT    NOT NULL,
    role       TEXT    NOT NULL,
    content    TEXT    NOT NULL,
    source     TEXT    NOT NULL DEFAULT 'local',
    created_at TEXT    NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages (session);
`);

logger.info("database ready", { file });

const now = () => new Date().toISOString();

/* ------------------------------- contacts ------------------------------- */

export function createContact(input) {
  const ticket = `NSM-${randomUUID().slice(0, 8).toUpperCase()}`;
  db.prepare(
    `INSERT INTO contacts (ticket, name, email, subject, message, ip, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    ticket,
    input.name,
    input.email,
    input.subject || "",
    input.message,
    input.ip || "",
    input.userAgent || "",
    now()
  );
  return { ticket, status: "received" };
}

export function getContactByTicket(ticket) {
  const row = db
    .prepare("SELECT ticket, name, subject, status, created_at FROM contacts WHERE ticket = ?")
    .get(ticket);
  return row ?? null;
}

export function markContactStatus(ticket, status) {
  db.prepare("UPDATE contacts SET status = ? WHERE ticket = ?").run(status, ticket);
}

export function countContacts() {
  return Number(db.prepare("SELECT COUNT(*) AS n FROM contacts").get().n);
}

export function recentContacts(limit = 20) {
  return db
    .prepare(
      `SELECT ticket, name, email, subject, status, created_at
       FROM contacts ORDER BY id DESC LIMIT ?`
    )
    .all(Number(limit));
}

/* -------------------------------- events -------------------------------- */

export function trackEvent(event) {
  db.prepare(
    `INSERT INTO events (type, path, ref, session, label, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    event.type,
    event.path || "",
    event.ref || "",
    event.session || "",
    event.label || "",
    now()
  );
}

export function analyticsSummary() {
  const total = Number(db.prepare("SELECT COUNT(*) AS n FROM events WHERE type = 'pageview'").get().n);
  const uniques = Number(
    db.prepare("SELECT COUNT(DISTINCT session) AS n FROM events WHERE type = 'pageview' AND session <> ''").get().n
  );
  const counts = db
    .prepare("SELECT type, COUNT(*) AS n FROM events GROUP BY type")
    .all()
    .reduce((acc, row) => ({ ...acc, [row.type]: Number(row.n) }), {});
  const topProjects = db
    .prepare(
      `SELECT label, COUNT(*) AS views FROM events
       WHERE type = 'project_view' AND label <> ''
       GROUP BY label ORDER BY views DESC LIMIT 5`
    )
    .all()
    .map((row) => ({ id: row.label, views: Number(row.views) }));

  return {
    pageviews: total,
    uniqueVisitors: uniques,
    events: counts,
    topProjects,
    messages: countContacts(),
  };
}

/* --------------------------------- chat --------------------------------- */

export function recordChatMessage({ session, role, content, source = "local" }) {
  db.prepare(
    `INSERT INTO chat_messages (session, role, content, source, created_at)
     VALUES (?, ?, ?, ?, ?)`
  ).run(session, role, content, source, now());
}

export function chatHistory(session, limit = 12) {
  return db
    .prepare(
      `SELECT role, content, source, created_at FROM (
         SELECT * FROM chat_messages WHERE session = ? ORDER BY id DESC LIMIT ?
       ) ORDER BY id ASC`
    )
    .all(session, Number(limit));
}

export default db;
