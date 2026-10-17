import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { config, aiEnabled } from "../config.js";
import { logger } from "../lib/logger.js";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests to the AI Learning Studio. Please slow down." },
});

const schema = z.object({
  subject: z.string().trim().min(1).max(100),
  topic: z.string().trim().min(1).max(150),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  action: z.enum(["explain", "example", "quiz", "interview", "feedback"]).default("explain"),
  language: z.enum(["english", "malayalam"]).default("english"),
  userInput: z.string().trim().max(3000).optional().default(""),
});

const SUBJECTS = [
  "Python Programming",
  "SQL",
  "Excel",
  "Power BI",
  "Tableau",
  "Statistics & EDA",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Generative AI & RAG",
];

async function callGemini(prompt) {
  if (!aiEnabled) throw new Error("gemini-not-configured");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.gemini.model}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": config.gemini.apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 1200 },
    }),
    signal: AbortSignal.timeout(config.gemini.timeoutMs || 25000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`gemini ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? []).map((p) => p.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned empty text");
  return text;
}

function buildPrompt({ subject, topic, level, action, language, userInput }) {
  const langPrompt = language === "malayalam"
    ? "Respond in clear Malayalam language (using Malayalam script). Where technical terms like algorithms or code keywords are used, you may keep the English technical term in brackets or inline."
    : "Respond in clear, professional, engaging English.";

  const levelDesc = {
    beginner: "a beginner student looking for simple, intuitive explanations without heavy jargon",
    intermediate: "an intermediate learner who understands the basics and wants practical, industry-standard depth",
    advanced: "an advanced practitioner seeking production-grade architectural nuances, performance considerations, and edge cases",
  }[level];

  const persona = `You are Mohammed Nasim's AI Trainer & Technical Instructor in ${subject}. You represent Mohammed Nasim P (Data Science & AI Trainer, AI Developer). Your teaching style is practical, encouraging, clear, and focused on building real understanding. Target audience: ${levelDesc}. Language directive: ${langPrompt}.
Important teaching rules:
1. Prefer beginner-friendly clarity and practical real-world analogies.
2. For Python/SQL/DAX code, write clean, readable, bug-free, copy-paste ready code with short comments.
3. For quizzes, always explain why the correct answer is correct and why other options are incorrect.
4. Avoid claiming AI answers are infallibly true; advise students to test code in safe environments.
5. Do not ask for or collect sensitive personal info.`;

  if (action === "explain") {
    return `${persona}

TASK: Explain the topic "${topic}" in "${subject}".
Include:
- 💡 Core Concept in simple terms (with an intuitive real-world analogy).
- ⚙️ How it works / Key components.
- 🎯 Practical industry use case.
- 🚀 Recommended next topic to explore.
Format with clean markdown headings and bullet points. Keep it concise, engaging, and under 380 words.`;
  }

  if (action === "example") {
    return `${persona}

TASK: Provide a comprehensive, step-by-step practical example for "${topic}" in "${subject}".
Include:
- 📝 Brief scenario.
- 💻 Code or formula snippet (well-commented Python, SQL, DAX, or Excel formula).
- 🔍 Step-by-step breakdown of how the example executes.
- ⚠️ Common pitfalls or beginner mistakes to avoid.
Format cleanly with code blocks.`;
  }

  if (action === "quiz") {
    return `${persona}

TASK: Generate 3 high-quality multiple-choice questions (MCQs) testing understanding of "${topic}" in "${subject}".
Strict Output Requirement: Return ONLY a valid JSON object without markdown fences, without \`\`\`json wrappers, and with exactly this schema:
{
  "questions": [
    {
      "q": "Question text here?",
      "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
      "answer": "A",
      "explanation": "Clear explanation of why option A is correct and why other options are wrong."
    }
  ]
}`;
  }

  if (action === "interview") {
    return `${persona}

TASK: Provide 4 realistic technical interview questions frequently asked by recruiters and hiring managers for "${topic}" in "${subject}".
Include:
- For each question:
  - ❓ Question & Difficulty rating (Junior / Mid / Senior).
  - 🎯 What the interviewer is evaluating.
  - ⭐ Model response with key buzzwords and conceptual clarity.
Format clearly with numbered points.`;
  }

  if (action === "feedback") {
    return `${persona}

TASK: Review this learner's submitted code or written answer on "${topic}" in "${subject}":
Learner submission:
"""
${userInput || "No code provided"}
"""

Provide constructive, mentoring feedback:
1. ✅ Strengths & what is correct.
2. ⚠️ Weaknesses, syntax issues, or anti-patterns (if any).
3. 💡 Optimized / refined solution with explanations.
4. 🌟 Trainer's tip for interview readiness.
Keep tone warm, professional, and empowering.`;
  }

  return `${persona}\nExplain ${topic} in ${subject}.`;
}

function localFallback({ subject, topic, action, level }) {
  if (action === "quiz") {
    return JSON.stringify({
      questions: [
        {
          q: `In ${subject}, which of the following is considered a best practice when working with ${topic}?`,
          options: [
            "A) Validate data and handle edge cases systematically",
            "B) Skip exploratory analysis and deploy directly",
            "C) Hardcode all parameters and credentials",
            "D) Avoid documenting functions and workflows",
          ],
          answer: "A",
          explanation: "Validating data, testing edge cases, and adhering to modular engineering standards ensures robust performance and reliability.",
        },
        {
          q: `When applying ${topic} in an end-to-end data pipeline, what is the primary objective?`,
          options: [
            "A) Increasing computational latency unnecessarily",
            "B) Transforming raw inputs into reliable, actionable insights",
            "C) Removing all data structures and metrics",
            "D) Preventing version control usage",
          ],
          answer: "B",
          explanation: "In modern Data Science & Analytics pipelines, the core goal is converting raw data into verifiable, actionable business insights.",
        },
      ],
    });
  }

  return `### 📘 ${subject}: ${topic} (${level.toUpperCase()})

*Offline Knowledge Mode Active* — For full generative responses, configure \`GEMINI_API_KEY\` in your environment.

#### 💡 Core Concept
**${topic}** is an essential building block in **${subject}**. In real-world enterprise applications, mastering this concept allows developers and data analysts to design scalable, maintainable solutions and uncover meaningful patterns.

#### 🛠️ Trainer Practical Note
1. Start with fundamental syntax and verify expected behaviors with reproducible mini-datasets.
2. Measure performance (time and space complexity or query efficiency).
3. Connect with Mohammed Nasim during workshops or via the portfolio contact form for direct 1-on-1 mentoring and curated project roadmaps!`;
}

const router = Router();

router.get("/subjects", (req, res) => {
  res.json({
    subjects: SUBJECTS,
    aiEnabled,
    model: config.gemini.model,
  });
});

router.post("/ask", limiter, async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: "validation_error",
        message: "Invalid learning studio request payload.",
        details: parsed.error.issues,
      });
    }

    const params = parsed.data;
    let reply = "";
    let source = "local";

    if (aiEnabled) {
      try {
        const prompt = buildPrompt(params);
        reply = await callGemini(prompt);
        source = "gemini";
      } catch (err) {
        logger.warn("learn studio gemini call failed, falling back to local curriculum", {
          error: String(err?.message || err),
        });
      }
    }

    if (!reply) {
      reply = localFallback(params);
    }

    res.json({
      reply,
      source,
      action: params.action,
      subject: params.subject,
      topic: params.topic,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
