import nodemailer from "nodemailer";
import { config, mailerEnabled } from "./config.js";
import { logger } from "./lib/logger.js";

let transport = null;

function getTransport() {
  if (!transport) {
    transport = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    });
  }
  return transport;
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Notify the portfolio owner about a new enquiry. */
export async function sendContactNotification(contact) {
  if (!mailerEnabled) {
    logger.warn("smtp not configured, contact stored in database only", { ticket: contact.ticket });
    return { sent: false, reason: "smtp-not-configured" };
  }

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#070b14;color:#eef2f8;padding:28px">
      <p style="letter-spacing:2px;color:#22d3ee;font-size:12px;margin:0 0 6px">
        NEW PORTFOLIO ENQUIRY · ${contact.ticket}
      </p>
      <h2 style="margin:0 0 18px">${escapeHtml(contact.subject || "New message")}</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#94a3b8">Name</td><td>${escapeHtml(contact.name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#94a3b8">Email</td><td>${escapeHtml(contact.email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#94a3b8">Received</td><td>${escapeHtml(contact.createdAt)}</td></tr>
      </table>
      <div style="margin-top:20px;padding:16px;border:1px solid rgba(34,211,238,0.25);border-radius:12px;
                  background:#0b1220;white-space:pre-wrap;line-height:1.7">
        ${escapeHtml(contact.message)}
      </div>
    </div>`;

  await getTransport().sendMail({
    from: config.smtp.from,
    to: config.smtp.to,
    replyTo: contact.email,
    subject: `[Portfolio] ${contact.subject || "New enquiry"} — ${contact.name}`,
    text: `${contact.name} <${contact.email}>\n${contact.ticket}\n\n${contact.message}`,
    html,
  });

  logger.info("contact notification sent", { ticket: contact.ticket });
  return { sent: true };
}

/** Confirm receipt to the person who filled in the form. */
export async function sendAutoReply(contact) {
  if (!mailerEnabled) return { sent: false, reason: "smtp-not-configured" };

  const text = `Hi ${contact.name},

Thanks for reaching out through my portfolio. Your message has been received and I will get back to you shortly.

Your reference number: ${contact.ticket}

— Mohammed Nasim P
Data Science & AI Trainer | Data Analyst | Generative AI Developer
${config.smtp.to}`;

  await getTransport().sendMail({
    from: config.smtp.from,
    to: contact.email,
    subject: `Thanks for reaching out — reference ${contact.ticket}`,
    text,
  });

  return { sent: true };
}

export { mailerEnabled };
