import { portfolio } from "../src/data/portfolio.js";

const projectLine = (p) =>
  `- ${p.title} (${p.categoryLabel}): ${p.description.split(" (Private")[0]}${
    p.github ? ` [${p.github}]` : " [private repository]"
  } Stack: ${p.stack.join(", ")}.`;

/**
 * Compact dossier handed to the LLM so answers stay grounded in the real
 * portfolio content instead of hallucinating.
 */
export function buildDossier() {
  const experience = portfolio.experience
    .map((e) => `- ${e.title} @ ${e.company} (${e.period})`)
    .join("\n");
  const skills = portfolio.skills
    .map((s) => `- ${s.category}: ${s.items.join(", ")}`)
    .join("\n");
  const services = portfolio.services.map((s) => `- ${s.title}: ${s.description}`).join("\n");

  return `# About ${portfolio.name}
Role: ${portfolio.role}
Location: ${portfolio.location}
Email: ${portfolio.email}
Phone: ${portfolio.phone}
LinkedIn: ${portfolio.linkedin}
GitHub: ${portfolio.github}

Summary: ${portfolio.summary}

## Experience
${experience}

## Education
${portfolio.education.degree}, ${portfolio.education.institution} (${portfolio.education.period}), GPA ${portfolio.education.gpa}

## Skills
${skills}

## Services
${services}

## Projects
${portfolio.projects.map(projectLine).join("\n")}

## Certifications
${portfolio.certifications.map(([n, o, y]) => `- ${n} — ${o}${y ? ` (${y})` : ""}`).join("\n")}

## Achievements
${portfolio.achievements.map(([, t, d]) => `- ${t}: ${d}`).join("\n")}`;
}

export function buildSystemPrompt() {
  return `You are Mohammed Nasim P speaking directly in the first person ("I", "my", "me") on my personal portfolio website.

Key guidelines about my profile, voice and answers:
- Who I am: Data Science & AI Trainer, Data Analyst, and Generative / Agentic AI Developer based in Malappuram, Kerala.
- Tone: Professional, warm, humble, confident, and direct. Speak as me, not as a generic third-party bot.
- Career & Full-Time / Contract Roles:
  - I am actively seeking and enthusiastic about full-time and contract roles as an **Agentic AI Developer**, **Generative AI Engineer**, **Data Analyst**, or **Data Science & AI Technical Trainer**.
  - If a recruiter or hiring manager asks if I'm open to joining their team or company, enthusiastically confirm that I am eager to contribute my hands-on experience building Agentic AI workflows (LangGraph, LangChain, Tool Calling, Multi-Agent systems), RAG pipelines (ChromaDB, Vector search), and advanced Data Analytics (SQL, Power BI, Python, Excel, Machine Learning).
- Salary Expectations:
  - When asked about salary, compensation, or expected package, state that I am open to discussion based on the role and responsibilities, with my expected range typically around **3 to 4 LPA** (Lakhs Per Annum).
- Freelance Projects:
  - I am available for freelance contracts in:
    1. **Agentic AI & Generative AI:** Autonomous multi-agent systems, LangGraph task routers, enterprise RAG document assistants, and custom LLM tool integration.
    2. **Data Analytics & BI:** End-to-end Power BI dashboards with DAX, Excel modeling, advanced SQL queries, and predictive ML/DL pipelines.
    3. **Python Automation:** Data cleansing scripts, ETL pipelines, and API integrations.
- Corporate & Academic Training Across Kerala:
  - I deliver hands-on workshops, bootcamps, and curriculum training across Kerala (and remotely worldwide) in Python, SQL, Power BI, Machine Learning, Deep Learning, Generative AI, and Agentic AI.
- Contact: Encourage visitors to connect with me directly via email (${portfolio.email}), phone (${portfolio.phone}), LinkedIn (${portfolio.linkedin}), or the contact form below.
- Conciseness: Keep responses crisp (under 130 words), professional, formatted with clean bullet points or short paragraphs.
- Fact Integrity: Use the dossier below for my verified background, education, and shipped projects. Never invent unrelated experiences.

# DOSSIER
${buildDossier()}`;
}

export const suggestions = [
  "Are you open to Agentic AI & Data Analyst roles?",
  "What Agentic AI & RAG projects have you built?",
  "What freelance services do you offer?",
  "What is your expected salary?",
  "Do you conduct corporate/college AI training in Kerala?",
  "How can we collaborate or hire you?",
];

/* ------------------------- offline answer engine ------------------------- */

const includesAny = (text, words) => words.some((word) => text.includes(word));

function findProject(text) {
  return portfolio.projects.find((p) => {
    const title = p.title.toLowerCase();
    return text.includes(title) || title.split(/[\s—-]+/).some((w) => w.length > 4 && text.includes(w));
  });
}

function fmtProject(p) {
  const link = p.github ? `\nRepository: ${p.github}` : "\nThis one is a private repository, but I can walk you through the architecture.";
  return `${p.title} — ${p.categoryLabel}\n${p.description.split(" (Private")[0]}${link}\nStack: ${p.stack.join(", ")}`;
}

/**
 * Deterministic, dependency-free answers used when no LLM key is configured
 * (and as a safety net if the LLM call fails).
 */
export function localAnswer(question) {
  const text = ` ${question.toLowerCase().replace(/[^\w\s+#.-]/g, " ")} `;

  if (includesAny(text, [" hi ", " hello ", " hey ", " good morning ", " good evening "])) {
    return `Hello! I'm Mohammed Nasim P. Feel free to ask me anything about my data science projects, analytics skills, services, freelance work, or salary expectations. You can also connect with me directly through the contact section!`;
  }

  if (includesAny(text, ["agentic", "agent", "generative ai", "genai", "rag", "langgraph", "langchain", "llm"])) {
    return `Yes! I specialize heavily in Agentic AI and Generative AI development:\n• Architecture: Autonomous Multi-Agent systems, LangGraph workflows, Tool Calling & ReAct agents\n• Document Intelligence (RAG): Semantic search, ChromaDB vector indexing, context-grounded retrieval\n• Shipped Projects: SmartOfficeAI (Agentic office assistant with memory & calendar/email automation), AI Code Reviewer, Legal Document AI\n• Looking for: Full-time / Contract Agentic AI Developer roles and freelance AI implementations. Let's discuss at ${portfolio.email}!`;
  }

  if (includesAny(text, ["salary", "compensation", "package", "expected", "ctc", "lpa"])) {
    return `Regarding compensation, I am open to discussion based on the role, scope, and responsibilities. My typical expected range is around 3 to 4 LPA. I'm always happy to discuss what works best for mutual growth!`;
  }

  if (includesAny(text, ["freelance", "freelancing", "contract", "gig", "remote project", "client"])) {
    return `Yes, I am actively available for freelance contracts in:\n• Agentic AI & Generative AI: Custom LangGraph agents, RAG chatbots, LLM tool integration\n• Data Analytics & BI: Interactive Power BI & Excel dashboards, advanced SQL queries\n• Machine Learning & Computer Vision: Predictive models, YOLOv5, OpenCV\n• Hands-on corporate/college training across Kerala & remotely.\n\nReach out directly at ${portfolio.email} or call ${portfolio.phone}!`;
  }

  if (includesAny(text, ["training", "trainer", "workshop", "teach", "mentor", "kerala", "classes"])) {
    return `Yes! I provide hands-on technical training and mentoring across Kerala (and online nationwide) in Python, SQL, Power BI, Machine Learning, Deep Learning, Generative AI, and Agentic AI. Reach out at ${portfolio.email} or call ${portfolio.phone} to organize a session!`;
  }

  const project = findProject(text);
  if (project && includesAny(text, ["project", "built", "build", "made", "smartoffice", "legal", "stock", "exam", "spotify", "ipl", "chicken", "fraud", "event", "car sales", "code reviewer", "image"])) {
    return fmtProject(project);
  }

  if (includesAny(text, ["hire", "hiring", "available", "availability", "job", "recruit", "opportunit", "analyst", "role", "join", "company", "career"])) {
    return `I am actively looking for exciting roles as an **Agentic AI Developer**, **Generative AI Engineer**, **Data Analyst**, or **Data Science Trainer**, and I take on freelance contracts!\n• Expected Salary: Open to discussion (expected ~3 to 4 LPA)\n• Expertise: LangGraph, LangChain, RAG, Python, SQL, Power BI, Machine Learning\n• Freelance & Training: Available across Kerala and remotely\n• Email: ${portfolio.email} | Phone: ${portfolio.phone}\n• Location: ${portfolio.location}\nFeel free to drop a message through the contact form below!`;
  }

  if (includesAny(text, ["project", "portfolio", "work", "built", "showcase", "github"])) {
    const byCategory = portfolio.projectCategories
      .filter((c) => c.id !== "all")
      .map((c) => {
        const names = portfolio.projects.filter((p) => p.category === c.id).map((p) => p.title);
        return `• ${c.label}: ${names.join(", ")}`;
      })
      .join("\n");
    return `I have developed ${portfolio.projects.length} featured projects across three core areas:\n${byCategory}\n\nAsk me about any specific project (e.g., SmartOfficeAI or IPL Analysis) to learn more!`;
  }

  if (includesAny(text, ["skill", "tech", "stack", "tool", "language", "python", "sql", "power bi", "machine learning", "deep learning", "rag", "langchain", "langgraph"])) {
    return `Here are the core technologies I work with:\n` + portfolio.skills
      .map((s) => `• ${s.category}: ${s.items.join(", ")}`)
      .join("\n");
  }

  if (includesAny(text, ["service", "offer", "help with", "dashboard", "consult"])) {
    return `Here are the services I offer:\n${portfolio.services.map((s) => `• ${s.title} — ${s.description}`).join("\n")}`;
  }

  if (includesAny(text, ["experience", "work history", "career", "company", "employer", "current"])) {
    return `Here is my professional experience:\n` + portfolio.experience
      .map((e) => `• ${e.title} @ ${e.company} (${e.period}${e.current ? " - Present" : ""})`)
      .join("\n");
  }

  if (includesAny(text, ["education", "college", "degree", "study", "university", "b.e", "gpa"])) {
    const e = portfolio.education;
    return `Education:\n${e.degree} — ${e.institution}\n${e.period} · GPA: ${e.gpa}`;
  }

  if (includesAny(text, ["certificat", "course", "credential", "oracle"])) {
    return `My certifications:\n${portfolio.certifications
      .map(([n, o, y]) => `• ${n} — ${o}${y ? ` (${y})` : ""}`)
      .join("\n")}`;
  }

  if (includesAny(text, ["achiev", "award", "hackathon", "winner", "recognition"])) {
    return `Achievements & Recognitions:\n` + portfolio.achievements.map(([, t, d]) => `• ${t} — ${d}`).join("\n");
  }

  if (includesAny(text, ["resume", "cv"])) {
    return `You can download my résumé directly from the top of the page using the "Resume" button, or grab it at ${portfolio.resume}.`;
  }

  if (includesAny(text, [" who ", " about ", " nasim ", " your name", "introduce", "background", "summary"])) {
    return `I am ${portfolio.name}, a ${portfolio.role} based in ${portfolio.location}.\n${portfolio.summary}`;
  }

  return `I'm Mohammed Nasim P. You can ask me about my background, skills (Python, SQL, Power BI, ML, Agentic AI), projects, salary expectations (open to discussion, ~3-4 LPA), or freelance work and training across Kerala.\n\nFor direct discussions, email me at ${portfolio.email} or call ${portfolio.phone}.`;
}

export default { buildDossier, buildSystemPrompt, localAnswer, suggestions };
