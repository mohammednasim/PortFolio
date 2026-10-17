import { Router } from "express";
import rateLimit from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { aiEnabled } from "../config.js";
import { askGemini } from "../ai.js";
import { chatHistory, recordChatMessage } from "../db.js";
import { localAnswer, suggestions } from "../knowledge.js";
import { logger } from "../lib/logger.js";

const schema = z.object({
  message: z.string().trim().min(1, "Ask a question").max(1000),
  sessionId: z.string().trim().max(80).optional().default(""),
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "rate_limited", message: "You have reached the assistant limit. Try again later." },
});

const router = Router();

router.post("/", limiter, async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: "validation_error", message: "Please send a valid question." });
    }

    const sessionId = parsed.data.sessionId || randomUUID();
    const question = parsed.data.message;
    const history = chatHistory(sessionId, 8);

    recordChatMessage({ session: sessionId, role: "user", content: question });

    let reply = "";
    let source = "local";

    if (aiEnabled) {
      try {
        reply = await askGemini(history, question);
        source = "gemini";
      } catch (error) {
        logger.warn("assistant llm failed, using local engine", { error: String(error?.message || error) });
      }
    }

    if (!reply) reply = localAnswer(question);

    recordChatMessage({ session: sessionId, role: "assistant", content: reply, source });

    res.json({ reply, sessionId, source, suggestions });
  } catch (error) {
    next(error);
  }
});

router.get("/history", (req, res, next) => {
  try {
    const session = String(req.query.sessionId || "");
    if (!session) return res.json({ sessionId: "", messages: [] });
    res.json({ sessionId: session, messages: chatHistory(session, 20) });
  } catch (error) {
    next(error);
  }
});

router.get("/suggestions", (req, res) => {
  res.json({ suggestions, aiEnabled });
});

export default router;
