/**
 * Thin client for the portfolio API (server/index.js).
 *
 * The base URL defaults to the same origin (`/api`), which works in
 * production when Express serves the built site, and in development through
 * the dev-server proxy. Override it at runtime with:
 *   <script>window.__PORTFOLIO_API__ = "https://api.example.com/api"</script>
 */
const BASE =
  (typeof window !== "undefined" && window.__PORTFOLIO_API__) || "/api";

const DEFAULT_TIMEOUT = 8000;

async function request(path, { method = "GET", body, timeout = DEFAULT_TIMEOUT, headers } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${BASE}${path}`, {
      method,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(headers || {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error = new Error(data?.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.fields = data?.fields || null;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;
    const offline = new Error("The API is unreachable right now.");
    offline.offline = true;
    throw offline;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------ session id ------------------------------ */

export function getSessionId() {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem("nasim.session");
    if (!id) {
      id = `s_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      window.localStorage.setItem("nasim.session", id);
    }
    return id;
  } catch {
    return "";
  }
}

/* -------------------------------- content ------------------------------- */

export async function loadPortfolio(fallback) {
  try {
    const data = await request("/portfolio", { timeout: 5000 });
    return { data, live: true };
  } catch {
    return { data: fallback, live: false };
  }
}

export const getPublicStats = () => request("/stats/public", { timeout: 4000 });

/* ------------------------------ interactions ---------------------------- */

export const track = (type, payload = {}) =>
  request("/analytics/events", {
    method: "POST",
    timeout: 4000,
    body: { type, session: getSessionId(), path: window.location.pathname, ref: document.referrer, ...payload },
  }).catch(() => null);

export const submitContact = (payload) =>
  request("/contact", { method: "POST", timeout: 12000, body: payload });

export const askAssistant = (message, sessionId) =>
  request("/chat", { method: "POST", timeout: 25000, body: { message, sessionId } });

export const getTutorSubjects = () => request('/learn/subjects', { timeout: 5000 });

export const askTutor = (payload) =>
  request('/learn/ask', { method: 'POST', timeout: 30000, body: payload });

export default { loadPortfolio, getPublicStats, track, submitContact, askAssistant, getSessionId, getTutorSubjects, askTutor };
