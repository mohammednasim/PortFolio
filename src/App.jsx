import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Code2,
  Database,
  Download,
  Eye,
  ExternalLink,
  Github,
  GraduationCap,
  LayoutDashboard,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Scene from "./components/Scene";
import SectionTitle from "./components/SectionTitle";
import ProjectCard from "./components/ProjectCard";
import Character from "./components/Character";
import ChatAssistant from "./components/ChatAssistant";
import LearningStudio from "./components/LearningStudio";
import WorkSimulation from "./components/WorkSimulation";
import { portfolio as staticPortfolio } from "./data/portfolio";
import { getPublicStats, loadPortfolio, submitContact, track } from "./lib/api";
import useHeroPointer from "./lib/useHeroPointer";

const nav = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["services", "Services"],
  ["learn", "Learning Studio"],
  ["contact", "Contact"],
];

const skillIcons = {
  code: Code2,
  chart: BarChart3,
  brain: Brain,
  sparkles: Sparkles,
  eye: Eye,
};

const serviceIcons = {
  "bar-chart": BarChart3,
  dashboard: LayoutDashboard,
  brain: Brain,
  bot: Bot,
  database: Database,
  code: Code2,
  graduation: GraduationCap,
  users: Users,
};

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", company: "" };

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const height = h.scrollHeight - h.clientHeight;
      setProgress(height > 0 ? (h.scrollTop / height) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [content, setContent] = useState(staticPortfolio);
  const [stats, setStats] = useState(null);
  const [live, setLive] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [mail, setMail] = useState({ status: "idle", message: "", fields: {} });

  const heroRef = useRef(null);
  const progress = useScrollProgress();
  const { setPull } = useHeroPointer(heroRef);

  /* ------------------------- live content + analytics ------------------------ */

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
    track("pageview");

    let alive = true;
    loadPortfolio(staticPortfolio).then(({ data, live: isLive }) => {
      if (!alive) return;
      if (data?.projects) setContent(data);
      setLive(isLive);
    });
    getPublicStats()
      .then((value) => alive && setStats(value))
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ------------------------------ derived data ------------------------------ */

  const filteredProjects = useMemo(() => {
    const all = content.projects || [];
    const filtered =
      activeFilter === "all" ? all : all.filter((p) => p.category === activeFilter);
    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [activeFilter, content]);

  const statCards = useMemo(
    () => [
      { value: `${content.projects.length}`, label: "Projects built" },
      { value: `${content.marquee.length}+`, label: "Core technologies" },
      { value: `${content.services.length}`, label: "Services offered" },
      { value: `${content.certifications.length}`, label: "Certifications" },
    ],
    [content]
  );

  /* -------------------------------- handlers -------------------------------- */

  const onField = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMail((prev) => (prev.fields[name] ? { ...prev, fields: { ...prev.fields, [name]: undefined } } : prev));
  };

  async function onMailSubmit(event) {
    event.preventDefault();
    if (mail.status === "sending") return;

    setMail({ status: "sending", message: "", fields: {} });
    try {
      const result = await submitContact({
        ...form,
        subject: form.subject || `Portfolio enquiry from ${form.name}`,
      });
      setForm(EMPTY_FORM);
      setMail({
        status: "sent",
        message: `Thank you — your message is in. Reference ${result.ticket}. I'll reply shortly.`,
        fields: {},
      });
      track("contact_submit");
    } catch (error) {
      if (error.fields) {
        setMail({ status: "error", message: "Please check the highlighted fields.", fields: error.fields });
      } else {
        setMail({
          status: "error",
          message: `Could not reach the contact service. Email ${staticPortfolio.email} directly instead.`,
          fields: {},
        });
      }
    }
  }

  return (
    <div className="app">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="noise" />

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <button className="brand" onClick={() => scrollTo("home")} aria-label="Home">
          <span className="brand-mark">N</span>
          <span>NASIM</span>
        </button>

        <nav className={menu ? "nav-links open" : "nav-links"}>
          {nav.map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                scrollTo(id);
                setMenu(false);
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <a href={content.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={17} />
          </a>
          <a href={content.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={17} />
          </a>
          <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Toggle menu">
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {/* ============================== HERO ============================== */}
        <section id="home" className="hero" ref={heroRef}>
          <div className="hero-bg">
            <Scene />
          </div>
          <div className="hero-aurora" aria-hidden="true">
            <span />
            <span />
          </div>

          <div className="hero-grid">
            <motion.div
              className="hero-copy-wrap"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-copy">
                <div className="status-pill">
                  <span /> {content.availability || "AVAILABLE FOR DATA & AI OPPORTUNITIES"}
                </div>
                <p className="hero-kicker">
                  DATA SCIENCE · ANALYTICS · ARTIFICIAL INTELLIGENCE
                </p>
                <h1>
                  Building Intelligent <span>Solutions</span> with Data &amp; AI.
                </h1>
                <p className="hero-summary">{content.summary}</p>

                <div className="identity-chips">
                  {content.identity.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>

                <div className="hero-actions">
                  <button className="primary-btn" onClick={() => scrollTo("projects")}>
                    Explore My Projects <ArrowRight size={17} />
                  </button>
                  <button className="secondary-btn" onClick={() => scrollTo("contact")}>
                    Let's Connect
                  </button>
                  <a
                    className="ghost-btn"
                    href={content.resume}
                    download
                    onClick={() => track("resume_download")}
                  >
                    <Download size={16} /> Resume
                  </a>
                </div>

                <div className="social-row">
                  <a href={content.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                  <a href={content.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                  <a href={`mailto:${content.email}`} aria-label="Email">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15 }}
            >
              <Character
                onFocusCharacter={() => setPull(1)}
                onBlurCharacter={() => setPull(0)}
              />
              <div className="scroll-hint">
                <ArrowDown size={15} /> Scroll to explore
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================== TECH MARQUEE ========================== */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...content.marquee, ...content.marquee].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i>◆</i>
              </span>
            ))}
          </div>
        </div>

        {/* ============================ STATS BAND =========================== */}
        <section className="stats-band" aria-label="Portfolio statistics">
          {statCards.map((card) => (
            <div className="stat-card" key={card.label}>
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </div>
          ))}
          <div className="stat-card api-card">
            <span className={`api-dot ${live ? "on" : ""}`} aria-hidden="true" />
            <span className="api-label">
              {live ? "Live portfolio API" : "Static content"}
              {stats?.pageviews ? ` · ${stats.pageviews} views` : ""}
            </span>
          </div>
        </section>

        {/* ============================= ABOUT ============================= */}
        <section id="about" className="section about-section">
          <SectionTitle
            number="01"
            eyebrow="ABOUT ME"
            title="Working at the intersection of Data Science, Analytics & AI"
          />
          <div className="about-layout">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55 }}
            >
              <p className="large-copy">
                I'm Mohammed Nasim P — a Data Science and Data Analytics Trainer
                and AI Developer focused on transforming data into actionable
                insights and building practical AI-powered applications.
              </p>
              <p>
                I work at the intersection of Data Science, Analytics, and
                Artificial Intelligence. Alongside training learners in practical
                data and AI technologies, I build applications and analytical
                solutions that turn technical concepts into useful outcomes.
              </p>
              <p>
                My current work combines technical training, project mentoring,
                coding best practices, and real-world dataset analysis — using
                Python, LangChain, LangGraph, Google Gemini, Streamlit, and
                modern ML workflows.
              </p>
              <button className="primary-btn small" onClick={() => scrollTo("experience")}>
                View My Experience <ArrowRight size={16} />
              </button>
            </motion.div>
            <div className="about-cards">
              {[
                ["01", "Data Science", "Analysis & modeling"],
                ["02", "Artificial Intelligence", "Intelligent systems"],
                ["03", "Generative AI", "LLMs & Agentic AI"],
                ["04", "Technical Training", "Mentoring & guidance"],
              ].map(([n, t, d], index) => (
                <motion.div
                  className="mini-card"
                  key={n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                >
                  <span>{n}</span>
                  <strong>{t}</strong>
                  <small>{d}</small>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================= SKILLS ============================ */}
        <section id="skills" className="section">
          <SectionTitle number="02" eyebrow="SKILLS" title="Technologies I work with" />
          <div className="skills-grid">
            {content.skills.map((s, i) => {
              const Icon = skillIcons[s.icon] || Code2;
              return (
                <motion.div
                  className={`skill-card ${s.color}`}
                  key={s.category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="skill-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{s.category}</h3>
                  <div className="skill-chips">
                    {s.items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ============================ PROJECTS =========================== */}
        <section id="projects" className="section projects-section">
          <SectionTitle
            number="03"
            eyebrow="PROJECTS"
            title="Selected work across AI, ML & Analytics"
          />

          <div className="project-filters">
            {content.projectCategories.map((cat) => {
              const count =
                cat.id === "all"
                  ? content.projects.length
                  : content.projects.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeFilter === cat.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(cat.id)}
                >
                  {cat.label}
                  <b>{count}</b>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              className="projects-grid"
              key={activeFilter}
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
            >
              {filteredProjects.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.4 }}
                  onClick={() => track("project_view", { project: p.id })}
                >
                  <ProjectCard project={p} featured={p.featured} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* =========================== EXPERIENCE ========================== */}
        <section id="experience" className="section">
          <SectionTitle number="04" eyebrow="EXPERIENCE" title="My professional journey" />
          <div className="experience-layout">
            <div className="timeline">
              {content.experience.map((e, i) => (
                <motion.article
                  className={`experience-card ${e.current ? "current" : ""}`}
                  key={e.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55 }}
                >
                  <div className="timeline-dot" />
                  <div className="experience-meta">
                    <span>{e.period}</span>
                    {e.current && <b>Current</b>}
                  </div>
                  <h3>{e.title}</h3>
                  <h4>{e.company}</h4>
                  <ul>
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
            <div className="education-panel">
              <div className="education-card">
                <div className="degree-icon">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <span className="muted">{content.education.period}</span>
                  <h3>{content.education.degree}</h3>
                  <p>{content.education.institution}</p>
                  <div className="gpa">
                    GPA <strong>{content.education.gpa}</strong>
                  </div>
                </div>
              </div>
              <div className="about-cards compact">
                {[
                  ["Trainer", "Python, SQL, ML, Power BI, NLP"],
                  ["Developer", "LangChain, LangGraph, Gemini, Streamlit"],
                ].map(([t, d]) => (
                  <div className="mini-card" key={t}>
                    <strong>{t}</strong>
                    <small>{d}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================ SERVICES =========================== */}
        <section id="services" className="section">
          <SectionTitle number="05" eyebrow="SERVICES" title="What I can help you with" />
          <div className="services-grid">
            {content.services.map((s, i) => {
              const Icon = serviceIcons[s.icon] || Code2;
              return (
                <motion.div
                  className="service-card"
                  key={s.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                >
                  <div className="service-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <button className="service-cta" onClick={() => scrollTo("contact")}>
                    Get in touch <ArrowRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ========================= CERTIFICATIONS ======================== */}
        <section id="certifications" className="section">
          <SectionTitle number="06" eyebrow="CERTIFICATIONS" title="My credentials" />
          <div className="cert-grid">
            {content.certifications.map(([name, org, year]) => (
              <div className="cert-card" key={name}>
                <div className="cert-icon">◇</div>
                <div>
                  <strong>{name}</strong>
                  <span>{org}</span>
                  {year && <small>{year}</small>}
                </div>
                <ExternalLink size={15} />
              </div>
            ))}
          </div>
        </section>

        {/* ========================== ACHIEVEMENTS ========================= */}
        <section id="achievements" className="section">
          <SectionTitle number="07" eyebrow="ACHIEVEMENTS" title="Highlights & recognition" />
          <div className="achievement-grid">
            {content.achievements.map(([icon, title, desc]) => (
              <div className="achievement-card" key={title}>
                <div>{icon}</div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===================== AI LEARNING STUDIO ===================== */}
        <section id="learn" className="section learn-section">
          <SectionTitle
            number="08"
            eyebrow="AI TRAINER &amp; LEARNING STUDIO"
            title="Interactive Data Science &amp; AI Classroom"
          />
          <LearningStudio />
        </section>

        {/* ============================ CONTACT ============================ */}
        <section id="contact" className="section contact-section">
          <SectionTitle number="09" eyebrow="CONTACT" title="Let's work together" />
          <div className="contact-grid">
            <div className="contact-copy">
              <p>
                Have a project in mind, need a data scientist, or want to
                collaborate? Feel free to reach out for freelance projects,
                training collaborations, AI development, or professional
                networking.
              </p>
              <div className="contact-lines">
                <a href={`mailto:${content.email}`}>
                  <Mail size={17} /> <span>{content.email}</span>
                </a>
                <a href={`tel:${content.phone}`}>
                  <Phone size={17} /> <span>{content.phone}</span>
                </a>
                <div>
                  <MapPin size={17} /> <span>{content.location}</span>
                </div>
              </div>
              <div className="social-large">
                <a href={content.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={content.github} target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>

            <form className="contact-form" onSubmit={onMailSubmit} noValidate>
              <div className="form-row">
                <label className={`field ${mail.fields.name ? "invalid" : ""}`}>
                  <input
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={onField}
                    required
                  />
                  {mail.fields.name && <small>{mail.fields.name}</small>}
                </label>
                <label className={`field ${mail.fields.email ? "invalid" : ""}`}>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={onField}
                    required
                  />
                  {mail.fields.email && <small>{mail.fields.email}</small>}
                </label>
              </div>

              <label className={`field ${mail.fields.subject ? "invalid" : ""}`}>
                <input
                  name="subject"
                  placeholder="Subject (optional)"
                  value={form.subject}
                  onChange={onField}
                />
                {mail.fields.subject && <small>{mail.fields.subject}</small>}
              </label>

              <label className={`field ${mail.fields.message ? "invalid" : ""}`}>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell me about your project or requirement..."
                  value={form.message}
                  onChange={onField}
                  required
                />
                {mail.fields.message && <small>{mail.fields.message}</small>}
              </label>

              {/* honeypot — hidden from humans, bots fill it in */}
              <input
                className="honeypot"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={form.company}
                onChange={onField}
                aria-hidden="true"
              />

              <button className="primary-btn" type="submit" disabled={mail.status === "sending"}>
                {mail.status === "sending" ? (
                  <>
                    <Loader2 className="spin" size={17} /> Sending…
                  </>
                ) : (
                  <>
                    Send Message <Send size={17} />
                  </>
                )}
              </button>

              {mail.status !== "idle" && mail.status !== "sending" && (
                <p className={`form-status ${mail.status}`}>
                  {mail.status === "sent" ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <AlertCircle size={15} />
                  )}
                  {mail.message}
                </p>
              )}

              <p className="form-note">
                Messages are stored securely with a reference ticket and can be
                emailed to me automatically.
              </p>
            </form>
          </div>
        </section>
      {/* ========================== FREELANCE & HIRE ME ========================== */}
<section id="freelance" className="section freelance-section">
  <SectionTitle number="10" eyebrow="FREELANCE COLLABORATION" title="Available for Freelance Projects" />
  
  {/* What If Nasim Worked for You? Interactive Simulation */}
  <WorkSimulation />

  <div className="freelance-copy">
    <p>
      Whether you need an end-to-end Power BI report, a customized machine learning pipeline, an enterprise RAG agent,
      or hands-on data science corporate workshops, I'm ready to collaborate.
    </p>
    <div className="hire-buttons">
      <button className="primary-btn" onClick={() => scrollTo('contact')}>
        Interested to Hire <ArrowRight size={14} />
      </button>
      <motion.button
        className="secondary-btn"
        whileHover={{ x: 150, transition: { type: 'spring', stiffness: 300 } }}
        onClick={() => {}}
      >
        Not Interested
      </motion.button>
    </div>
  </div>
</section>
</main>

      <footer>
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NASIM</span>
        </div>
        <span>© {new Date().getFullYear()} Mohammed Nasim P. All rights reserved.</span>
        <button onClick={() => scrollTo("home")}>Back to top ↑</button>
      </footer>

      <ChatAssistant />
    </div>
  );
}
