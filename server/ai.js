import { config, aiEnabled } from "./config.js";
import { buildSystemPrompt } from "./knowledge.js";
import { logger } from "./lib/logger.js";

/**
 * Minimal Gemini REST client — avoids pulling the full SDK into the
 * server bundle. Falls back to the local answer engine when unavailable.
 */
export async function askGemini(history, question) {
  if (!aiEnabled) throw new Error("gemini-not-configured");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent`;
  const contents = [
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    { role: "user", parts: [{ text: question }] },
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": config.gemini.apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
      contents,
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 800 },
    }),
    signal: AbortSignal.timeout(config.gemini.timeoutMs),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`gemini ${response.status}: ${detail.slice(0, 200)}`);
  }

  const data = await response.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) throw new Error("gemini returned an empty response");
  logger.debug("gemini reply generated", { chars: text.length });
  return text;
}
