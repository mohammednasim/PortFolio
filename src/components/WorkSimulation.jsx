import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  Database,
  Bot,
  LayoutDashboard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";

const SCENARIOS = [
  {
    id: "sales-drop",
    icon: TrendingDown,
    color: "cyan",
    badge: "Analytics & Root Cause Analysis",
    title: "Your sales dropped by 30%. What would Nasim investigate?",
    summary:
      "A systematic diagnostic breakdown of transactions, seasonal factors, customer cohorts, and pricing levers.",
    steps: [
      {
        step: 1,
        title: "Isolate & De-aggregate the Data",
        detail:
          "Query SQL warehouse to slice the drop by geography, product category, customer segment, and acquisition channel. Confirm if the drop is broad or concentrated in a specific SKU.",
        tech: "SQL · Pandas · Time-Series Decomposition",
      },
      {
        step: 2,
        title: "Funnel & Churn Cohort Analysis",
        detail:
          "Analyze the checkout conversion funnel. Did bounce rates spike at payment? Did customer return rate decline or did new customer acquisition stall?",
        tech: "Cohort Retention Matrices · GA4 / Database logs",
      },
      {
        step: 3,
        title: "External & Operational Drivers",
        detail:
          "Cross-reference supply chain disruptions, competitors' pricing campaigns, website downtime incidents, and changes in ad spend ROI.",
        tech: "Anomaly Detection · Correlation Analysis",
      },
      {
        step: 4,
        title: "Executive Action Plan & Diagnostic Dashboard",
        detail:
          "Deliver an interactive Power BI dashboard isolating root causes within 48 hours, paired with a bulleted priority recovery plan for leadership.",
        tech: "Power BI · DAX · Actionable Executive Brief",
      },
    ],
    deliverable: "Root-Cause Audit Report + Real-Time Anomaly Dashboard",
  },
  {
    id: "messy-data",
    icon: Database,
    color: "violet",
    badge: "Data Engineering & Cleansing",
    title: "Your company has 1 million rows of messy data. What's the plan?",
    summary:
      "A high-throughput ETL & sanitization pipeline designed to handle duplicates, nulls, corrupted types, and schema anomalies.",
    steps: [
      {
        step: 1,
        title: "Profiling & Schema Discovery",
        detail:
          "Run automated statistical profiling using Python to quantify missing value ratios, duplicate keys, inconsistent text cases, and outlier distributions across all columns.",
        tech: "Python · Pandas · YData Profiling",
      },
      {
        step: 2,
        title: "Standardized Cleansing Rules",
        detail:
          "Implement programmatic normalization: string trimming, regex date parsing across formats, address standardization, and smart median/KNN imputations for critical gaps.",
        tech: "NumPy · Regular Expressions (Regex) · Fuzzy Matching",
      },
      {
        step: 3,
        title: "Relational Modeling & De-duplication",
        detail:
          "Transform single flat tables into 3rd Normal Form (Star Schema), creating clean Fact and Dimension tables with primary/foreign key referential integrity.",
        tech: "PostgreSQL / SQL Server · DB Constraints",
      },
      {
        step: 4,
        title: "Automated Validation Pipeline",
        detail:
          "Set up automated assertion tests so new ingested records are validated against data quality gates before touching production databases.",
        tech: "Great Expectations · Automated Logging",
      },
    ],
    deliverable: "Validated Star-Schema Database + Reusable Automated Cleanse Pipeline",
  },
  {
    id: "ai-chatbot",
    icon: Bot,
    color: "cyan",
    badge: "Generative AI & Agentic RAG",
    title: "Your business wants an AI chatbot. Where would he start?",
    summary:
      "End-to-end custom Agentic AI assistant grounded in your company's proprietary documents, FAQs, and APIs.",
    steps: [
      {
        step: 1,
        title: "Knowledge Audit & Chunking Strategy",
        detail:
          "Ingest internal knowledge bases (PDFs, Notion, CRM docs). Clean, tokenize, and chunk content with semantic overlap to preserve business context.",
        tech: "LangChain · PyPDF · Text Splitters",
      },
      {
        step: 2,
        title: "Vector Database & Semantic Retrieval (RAG)",
        detail:
          "Generate domain-specific embeddings and store in ChromaDB/Pinecone. Implement hybrid search (keyword + vector) for 99%+ context retrieval accuracy.",
        tech: "ChromaDB · Google Gemini / OpenAI Embeddings",
      },
      {
        step: 3,
        title: "Agentic Intent Routing & Tool Calling",
        detail:
          "Build a LangGraph stateful agent with routing logic: answered from company docs, escalate to human, or trigger actions (book appointment, check order status).",
        tech: "LangGraph · ReAct Agent Architecture",
      },
      {
        step: 4,
        title: "Guardrails & Web Deployment",
        detail:
          "Enforce strict system prompts to prevent hallucination. Deploy interactive web UI with session history, analytics, and instant answer streaming.",
        tech: "Streamlit / React · REST API · Hallucination Filters",
      },
    ],
    deliverable: "Production-Ready Agentic Chatbot with Custom Knowledge Base",
  },
  {
    id: "urgent-dashboard",
    icon: LayoutDashboard,
    color: "blue",
    badge: "Rapid Business Intelligence",
    title: "You need a Power BI dashboard by tomorrow. What's the workflow?",
    summary:
      "A battle-tested 24-hour sprint workflow transforming raw spreadsheets into an executive-ready interactive dashboard.",
    steps: [
      {
        step: 1,
        title: "Hour 0-2: Scope & Metric Alignment",
        detail:
          "Confirm the 3 to 5 core North Star KPIs the executive team cares about (e.g. Revenue, Margin, MoM Growth, Volume). Lock in data sources.",
        tech: "KPI Charter · Requirements Matrix",
      },
      {
        step: 2,
        title: "Hour 2-6: Power Query M Transformation",
        detail:
          "Import spreadsheets, unpivot messy cross-tab tables, format dates, and establish clean 1-to-many relationships in a robust Star Schema.",
        tech: "Power Query (M) · Data Modeling",
      },
      {
        step: 3,
        title: "Hour 6-12: Core DAX Measures & Time Intelligence",
        detail:
          "Write optimized DAX measures: Dynamic Year-over-Year (YoY) variances, Moving Averages, MTD/YTD totals, and parameter-driven currency converters.",
        tech: "DAX (CALCULATE, FILTER, DATESYTD)",
      },
      {
        step: 4,
        title: "Hour 12-18: Polished UI Design & Testing",
        detail:
          "Apply dark/light corporate glassmorphism styling, KPI summary cards with trend sparklines, interactive slicers, drill-through pages, and mobile view.",
        tech: "Power BI Service · UX Design · QA Validation",
      },
    ],
    deliverable: "Executive Power BI Dashboard (.pbix + published link) delivered on time",
  },
];

export default function WorkSimulation() {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id);
  const activeScenario = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];
  const Icon = activeScenario.icon;

  return (
    <div className="sim-container">
      <div className="sim-header">
        <div className="sim-pill">
          <Sparkles size={14} /> Interactive Simulation
        </div>
        <h3 className="sim-title">
          What If <span>Nasim Worked for You?</span> 🧪
        </h3>
        <p className="sim-subtitle">
          Choose a real-world scenario below and watch how I break down complex data, analytics, and AI challenges
          into high-impact, delivered results.
        </p>
      </div>

      {/* Scenario Selection Grid */}
      <div className="sim-selector-grid">
        {SCENARIOS.map((sc) => {
          const ScIcon = sc.icon;
          const isActive = sc.id === selectedId;

          return (
            <button
              key={sc.id}
              type="button"
              className={`sim-select-card ${sc.color} ${isActive ? "active" : ""}`}
              onClick={() => setSelectedId(sc.id)}
            >
              <div className="sim-card-top">
                <div className="sim-icon-box">
                  <ScIcon size={20} />
                </div>
                <span className="sim-badge">{sc.badge}</span>
              </div>
              <h4 className="sim-card-title">{sc.title}</h4>
            </button>
          );
        })}
      </div>

      {/* Interactive Workflow Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScenario.id}
          className="sim-workflow-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <div className="sim-wf-header">
            <div className="sim-wf-meta">
              <span className={`sim-tag ${activeScenario.color}`}>
                <Icon size={16} /> {activeScenario.badge}
              </span>
              <h4>{activeScenario.title}</h4>
              <p>{activeScenario.summary}</p>
            </div>
          </div>

          <div className="sim-steps-grid">
            {activeScenario.steps.map((st) => (
              <div key={st.step} className="sim-step-item">
                <div className="sim-step-indicator">
                  <span className="sim-step-num">0{st.step}</span>
                  <div className="sim-step-line" />
                </div>
                <div className="sim-step-content">
                  <h5>{st.title}</h5>
                  <p>{st.detail}</p>
                  <div className="sim-step-tech">
                    <Terminal size={12} /> {st.tech}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sim-deliverable-bar">
            <div className="sim-deliv-info">
              <CheckCircle2 size={18} className="sim-check-icon" />
              <span>
                <strong>Deliverable:</strong> {activeScenario.deliverable}
              </span>
            </div>
            <a
              href="#contact"
              className="primary-btn small"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Hire for This Project <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
