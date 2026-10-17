import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { createContact, getContactByTicket } from "../db.js";
import { sendAutoReply, sendContactNotification, mailerEnabled } from "../mailer.js";
import { logger } from "../lib/logger.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name").max(120),
  email: z.string().trim().min(5).max(200).regex(EMAIL_RE, "Please share a valid email address"),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(10, "Please add a little more detail").max(5000),
  // Honeypot: real users never fill this hidden field.
  company: z.string().max(0).optional().default(""),
});

// Enquiries are expensive (email + DB write), so keep this endpoint tight.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many messages sent. Please try again in a few minutes." },
});

const router = Router();

router.post("/", limiter, async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({
        error: "validation_error",
        message: "Please check the highlighted fields.",
        fields: Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path.join(".") || "_", issue.message])
        ),
      });
    }

    const payload = parsed.data;
    const contact = {
      ...payload,
      ip: req.ip || "",
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    };

    const { ticket } = createContact(contact);
    const createdAt = new Date().toISOString();
    logger.info("contact received", { ticket, email: payload.email });

    // Email delivery must never break the visitor's experience.
    let delivered = false;
    try {
      delivered = (await sendContactNotification({ ...contact, ticket, createdAt })).sent;
      await sendAutoReply({ ...contact, ticket });
    } catch (error) {
      logger.error("contact email failed", { ticket, error: String(error?.message || error) });
    }

    res.status(201).json({
      ok: true,
      ticket,
      delivered,
      mailerEnabled,
      message: delivered
        ? "Message delivered. You'll hear back soon."
        : "Message received and stored. It will be delivered as soon as the mail service is configured.",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:ticket", (req, res) => {
  const record = getContactByTicket(String(req.params.ticket).toUpperCase());
  if (!record) return res.status(404).json({ error: "not_found", message: "Unknown ticket" });
  res.json(record);
});

export default router;
