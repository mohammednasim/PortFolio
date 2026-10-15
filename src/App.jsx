import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Phone,
  MapPin,
  ExternalLink,
  Code2,
  BarChart3,
  Brain,
  Sparkles,
  Eye,
  LayoutDashboard,
  Bot,
  Database,
  GraduationCap,
  Users,
  ChevronDown,
} from "lucide-react";
import Scene from "./components/Scene";
import SectionTitle from "./components/SectionTitle";
import ProjectCard from "./components/ProjectCard";
import Character from "./components/Character";
import { portfolio } from "./data/portfolio";

const nav = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["services", "Services"],
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

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setProgress(height > 0 ? (scrolled / height) * 100 : 0);
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
  const progress = useScrollProgress();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";
  }, []);

  const filteredProjects = useMemo(() => {
    const all = portfolio.projects;
    const filtered =
      activeFilter === "all"
        ? all
        : all.filter((p) => p.category === activeFilter);
    return [...filtered].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [activeFilter]);

  const featuredProjects = portfolio.projects.filter((p) => p.featured);

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
          <a
            href={portfolio.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={17} />
          </a>
          <a
            href={portfolio.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github size={17} />
          </a>
          <button
            className="menu-btn"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="hero">
          <div className="hero-bg">
            <Scene />
          </div>
          <div className="hero-grid">
            <motion.div
              className="hero-copy"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="status-pill">
                <span /> AVAILABLE FOR DATA & AI OPPORTUNITIES
              </div>
              <p className="hero-kicker">
                DATA SCIENCE · ANALYTICS · ARTIFICIAL INTELLIGENCE
              </p>
              <h1>
                Building Intelligent <span>Solutions</span> with Data & AI.
              </h1>
              <p className="hero-summary">{portfolio.summary}</p>

              <div className="identity-chips">
                {portfolio.identity.map((label) => (
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
                  href={portfolio.resume}
                  download
                >
                  <Download size={16} /> Resume
                </a>
              </div>

              <div className="social-row">
                <a href={portfolio.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href={portfolio.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href={`mailto:${portfolio.email}`} aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.15 }}
            >
              <Character />
              <div className="scroll-hint">
                <ArrowDown size={15} /> Scroll to explore
              </div>
            </motion.div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section about-section">
          <SectionTitle
            number="01"
            eyebrow="ABOUT ME"
            title="Working at the intersection of Data Science, Analytics & AI"
          />
          <div className="about-layout">
            <div className="about-text">
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
            </div>
            <div className="about-cards">
              {[
                ["01", "Data Science", "Analysis & modeling"],
                ["02", "Artificial Intelligence", "Intelligent systems"],
                ["03", "Generative AI", "LLMs & Agentic AI"],
                ["04", "Technical Training", "Mentoring & guidance"],
              ].map(([n, t, d]) => (
                <div className="mini-card" key={n}>
                  <span>{n}</span>
                  <strong>{t}</strong>
                  <small>{d}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section">
          <SectionTitle
            number="02"
            eyebrow="SKILLS"
            title="Technologies I work with"
          />
          <div className="skills-grid">
            {portfolio.skills.map((s, i) => {
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

        {/* PROJECTS */}
        <section id="projects" className="section projects-section">
          <SectionTitle
            number="03"
            eyebrow="PROJECTS"
            title="Selected work across AI, ML & Analytics"
          />

          <div className="project-filters">
            {portfolio.projectCategories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${activeFilter === cat.id ? "active" : ""}`}
                onClick={() => setActiveFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              className="projects-grid"
              key={activeFilter}
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {filteredProjects.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <ProjectCard project={p} featured={p.featured} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="section">
          <SectionTitle
            number="04"
            eyebrow="EXPERIENCE"
            title="My professional journey"
          />
          <div className="experience-layout">
            <div className="timeline">
              {portfolio.experience.map((e, i) => (
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
                  <span className="muted">{portfolio.education.period}</span>
                  <h3>{portfolio.education.degree}</h3>
                  <p>{portfolio.education.institution}</p>
                  <div className="gpa">
                    GPA <strong>{portfolio.education.gpa}</strong>
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

        {/* SERVICES */}
        <section id="services" className="section">
          <SectionTitle
            number="05"
            eyebrow="SERVICES"
            title="What I can help you with"
          />
          <div className="services-grid">
            {portfolio.services.map((s, i) => {
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
                  <button
                    className="service-cta"
                    onClick={() => scrollTo("contact")}
                  >
                    Get in touch <ArrowRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section id="certifications" className="section">
          <SectionTitle
            number="06"
            eyebrow="CERTIFICATIONS"
            title="My credentials"
          />
          <div className="cert-grid">
            {portfolio.certifications.map(([name, org, year]) => (
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

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="section">
          <SectionTitle
            number="07"
            eyebrow="ACHIEVEMENTS"
            title="Highlights & recognition"
          />
          <div className="achievement-grid">
            {portfolio.achievements.map(([icon, title, desc]) => (
              <div className="achievement-card" key={title}>
                <div>{icon}</div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section contact-section">
          <SectionTitle
            number="08"
            eyebrow="CONTACT"
            title="Let's work together"
          />
          <div className="contact-grid">
            <div className="contact-copy">
              <p>
                Have a project in mind, need a data scientist, or want to
                collaborate? Feel free to reach out for freelance projects,
                training collaborations, AI development, or professional
                networking.
              </p>
              <div className="contact-lines">
                <a href={`mailto:${portfolio.email}`}>
                  <Mail size={17} /> <span>{portfolio.email}</span>
                </a>
                <a href={`tel:${portfolio.phone}`}>
                  <Phone size={17} /> <span>{portfolio.phone}</span>
                </a>
                <div>
                  <MapPin size={17} /> <span>{portfolio.location}</span>
                </div>
              </div>
              <div className="social-large">
                <a href={portfolio.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={portfolio.github} target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub
                </a>
              </div>
            </div>
            <form
              className="contact-form"
              action={`mailto:${portfolio.email}`}
              method="post"
              encType="text/plain"
            >
              <div className="form-row">
                <input name="name" placeholder="Your name" required />
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
              <input name="subject" placeholder="Subject" />
              <textarea
                name="message"
                rows="6"
                placeholder="Your message..."
                required
              />
              <button className="primary-btn" type="submit">
                Send Message <ArrowRight size={17} />
              </button>
              <p className="form-note">
                This opens your email client. For a direct backend form, a
                service like Formspree can be connected.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand">
          <span className="brand-mark">N</span>
          <span>NASIM</span>
        </div>
        <span>
          © {new Date().getFullYear()} Mohammed Nasim P. All rights reserved.
        </span>
        <button onClick={() => scrollTo("home")}>Back to top ↑</button>
      </footer>
    </div>
  );
}
