import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Send, Sparkles, X } from "lucide-react";
import { askAssistant, getSessionId } from "../lib/api";

const STARTERS = [
  "Are you open to Agentic AI & Data Analyst roles?",
  "What Agentic AI & RAG projects have you built?",
  "What freelance services do you offer?",
  "What is your expected salary?",
  "Do you conduct AI training in Kerala?",
];

let sessionCache = "";

/**
 * Floating portfolio assistant, backed by POST /api/chat.
 * The server answers with Gemini when a key is configured and falls back to
 * its built-in knowledge engine otherwise, so this widget always replies.
 */
export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [engine, setEngine] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Mohammed Nasim P. Ask me anything about my Agentic AI & GenAI developments, Data Analytics projects, full-time/contract opportunities, salary expectations, freelance work, or training sessions!",
    },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, open, busy]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(question) {
    const text = question.trim();
    if (!text || busy) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setBusy(true);

    try {
      if (!sessionCache) sessionCache = getSessionId();
      const data = await askAssistant(text, sessionCache);
      if (data?.sessionId) sessionCache = data.sessionId;
      if (data?.source) setEngine(data.source === "gemini" ? "Gemini" : "Portfolio knowledge base");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I can't reach the assistant service right now. You can still email nasimparammel@gmail.com or use the contact form below — he replies quickly.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className={`assistant-fab ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close the AI assistant" : "Open the AI assistant"}
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
        {!open && <span className="fab-ping" aria-hidden="true" />}
      </button>

      {open && (
        <section className="assistant-panel" aria-label="Portfolio AI assistant">
          <header>
            <span className="assistant-avatar">
              <Bot size={16} />
            </span>
            <div>
              <strong>Mohammed Nasim P</strong>
              <small>{engine ? `Answering via ${engine}` : "Agentic AI, Data Analytics & Opportunities"}</small>
            </div>
          </header>

          <div className="assistant-log" ref={listRef}>
            {messages.map((message, index) => (
              <div key={index} className={`bubble ${message.role}`}>
                {message.content}
              </div>
            ))}
            {busy && (
              <div className="bubble assistant typing" aria-label="Thinking">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>

          {messages.length < 3 && (
            <div className="assistant-starters">
              {STARTERS.map((starter) => (
                <button key={starter} onClick={() => send(starter)} disabled={busy}>
                  {starter}
                </button>
              ))}
            </div>
          )}

          <form
            className="assistant-input"
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              aria-label="Your question"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
              {busy ? <ArrowUp size={16} /> : <Send size={16} />}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
