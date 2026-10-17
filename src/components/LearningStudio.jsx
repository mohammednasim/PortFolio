import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Code2,
  BarChart3,
  Brain,
  Sparkles,
  Database,
  MessageSquare,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  RefreshCw,
  Globe,
  Award,
  Layers,
  Lightbulb,
} from "lucide-react";
import { getTutorSubjects, askTutor } from "../lib/api";

const SUBJECT_ICONS = {
  "Python Programming": Code2,
  SQL: Database,
  Excel: BarChart3,
  "Power BI": BarChart3,
  Tableau: BarChart3,
  "Statistics & EDA": BarChart3,
  "Machine Learning": Brain,
  "Deep Learning": Brain,
  "Natural Language Processing": MessageSquare,
  "Generative AI & RAG": Sparkles,
};

const SUBJECT_COLORS = [
  "cyan",
  "blue",
  "violet",
  "cyan",
  "blue",
  "violet",
  "cyan",
  "blue",
  "violet",
  "cyan",
];

const LEVELS = [
  { id: "beginner", label: "Beginner", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", emoji: "⚡" },
  { id: "advanced", label: "Advanced", emoji: "🚀" },
];

const ACTIONS = [
  { id: "explain", label: "Explain Simply", icon: BookOpen, desc: "Intuitive concepts & real-world analogies" },
  { id: "example", label: "Give Me an Example", icon: Code2, desc: "Step-by-step code & walk-throughs" },
  { id: "quiz", label: "Quiz Me", icon: HelpCircle, desc: "Interactive MCQs with scoring & explanations" },
  { id: "interview", label: "Interview Practice", icon: Briefcase, desc: "Curated questions & model answers" },
  { id: "feedback", label: "Review My Code", icon: CheckCircle2, desc: "Constructive mentoring on your code/answer" },
];

const TOPIC_SUGGESTIONS = {
  "Python Programming": [
    "Variables & Data Types",
    "List Comprehensions & Lambdas",
    "Object-Oriented Programming (OOP)",
    "Exception Handling & Decorators",
    "File I/O & JSON Parsing",
    "Pandas & NumPy for Data Analysis",
  ],
  SQL: [
    "SELECT, WHERE & Filtering",
    "INNER, LEFT & FULL JOINs",
    "GROUP BY, HAVING & Aggregations",
    "Subqueries & Common Table Expressions (CTEs)",
    "Window Functions (ROW_NUMBER, RANK, DENSE_RANK)",
    "Indexes & Query Optimization",
  ],
  Excel: [
    "VLOOKUP & XLOOKUP",
    "Dynamic Pivot Tables & Slicers",
    "Nested IF, AND, OR Formulas",
    "INDEX & MATCH Combinations",
    "Power Query & Data Cleaning",
    "Interactive KPI Dashboarding",
  ],
  "Power BI": [
    "DAX Fundamentals (CALCULATE, FILTER, ALL)",
    "Star Schema & Relational Data Modeling",
    "Time Intelligence Functions (YTD, MTD, SAMEPERIODLASTYEAR)",
    "Drill-Through Reports & Bookmarks",
    "Row-Level Security (RLS)",
    "Power Query M Transformations",
  ],
  Tableau: [
    "Calculated Fields & Parameters",
    "Level of Detail (LOD) Expressions",
    "Dual-Axis & Combined Visualizations",
    "Dashboard Actions & Interactivity",
    "Table Calculations & Quick Measures",
  ],
  "Statistics & EDA": [
    "Measures of Central Tendency & Dispersion",
    "Correlation vs Causation & Heatmaps",
    "Hypothesis Testing (p-values, t-test, ANOVA)",
    "Outlier Detection & IQR / Z-Score",
    "Feature Distribution & Skewness Handling",
  ],
  "Machine Learning": [
    "Linear & Logistic Regression",
    "Decision Trees & Random Forests",
    "Gradient Boosting (XGBoost & LightGBM)",
    "Cross-Validation & Hyperparameter Tuning",
    "Overfitting vs Underfitting (Bias-Variance Tradeoff)",
    "Model Evaluation (Precision, Recall, ROC-AUC)",
  ],
  "Deep Learning": [
    "Perceptrons & Multi-Layer Neural Networks",
    "Activation Functions (ReLU, Softmax, Sigmoid)",
    "Convolutional Neural Networks (CNNs) for Images",
    "Loss Functions & Backpropagation",
    "Transfer Learning with Pre-trained Models",
  ],
  "Natural Language Processing": [
    "Text Preprocessing & Tokenization",
    "TF-IDF & Bag-of-Words",
    "Word Embeddings (Word2Vec & BERT Embeddings)",
    "Sentiment Analysis & Classification",
    "Named Entity Recognition (NER)",
  ],
  "Generative AI & RAG": [
    "Prompt Engineering Best Practices",
    "Retrieval-Augmented Generation (RAG) Architecture",
    "Vector Databases & Cosine Similarity (ChromaDB)",
    "LangChain Chains & Output Parsers",
    "LangGraph Multi-Agent Workflows",
    "Agentic AI Tool Calling & ReAct Framework",
  ],
};

function QuizView({ content, onReset }) {
  let parsedQuestions = [];
  try {
    const raw = typeof content === "string" ? JSON.parse(content) : content;
    parsedQuestions = raw.questions || [];
  } catch {
    // If not JSON, check if JSON is inside markdown blocks
    const match = content.match(/\{[\s\S]*"questions"[\s\S]*\}/);
    if (match) {
      try {
        parsedQuestions = JSON.parse(match[0]).questions || [];
      } catch {
        parsedQuestions = [];
      }
    }
  }

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!parsedQuestions.length) {
    return (
      <div className="ls-raw-content">
        <pre className="ls-pre">{content}</pre>
        <button className="secondary-btn small" onClick={onReset} style={{ marginTop: 12 }}>
          <RefreshCw size={14} /> Regenerate Quiz
        </button>
      </div>
    );
  }

  const score = submitted
    ? parsedQuestions.filter((q, i) => {
        const userChoice = (answers[i] || "").trim().toUpperCase();
        const correctChoice = (q.answer || "").trim().toUpperCase();
        return userChoice.startsWith(correctChoice[0]);
      }).length
    : 0;

  return (
    <div className="ls-quiz">
      <div className="ls-quiz-bar">
        <span>
          <Award size={16} /> <strong>Interactive Knowledge Check</strong> (3 Questions)
        </span>
        {submitted && (
          <span className="ls-score-pill">
            Score: {score} / {parsedQuestions.length} ({Math.round((score / parsedQuestions.length) * 100)}%)
          </span>
        )}
      </div>

      {parsedQuestions.map((q, i) => {
        const correctLetter = (q.answer || "").trim().charAt(0).toUpperCase();
        const selectedLetter = answers[i];

        return (
          <div key={i} className="ls-question-block">
            <p className="ls-q-text">
              <strong>Question {i + 1}:</strong> {q.q}
            </p>
            <div className="ls-options">
              {q.options.map((opt) => {
                const optLetter = opt.trim().charAt(0).toUpperCase();
                const isSelected = selectedLetter === optLetter;
                const isCorrect = submitted && optLetter === correctLetter;
                const isWrong = submitted && isSelected && optLetter !== correctLetter;

                return (
                  <button
                    key={opt}
                    type="button"
                    className={`ls-option ${isSelected ? "selected" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                    onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [i]: optLetter }))}
                    disabled={submitted}
                  >
                    <span className="ls-opt-indicator">{optLetter}</span>
                    <span className="ls-opt-label">{opt.replace(/^[A-D]\)\s*/, "")}</span>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <motion.div
                className="ls-explanation-box"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="ls-explanation-title">
                  <Lightbulb size={15} /> Explanation
                </div>
                <p>{q.explanation}</p>
              </motion.div>
            )}
          </div>
        );
      })}

      <div className="ls-quiz-actions">
        {!submitted ? (
          <button
            type="button"
            className="primary-btn"
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < parsedQuestions.length}
          >
            Submit All Answers <CheckCircle2 size={16} />
          </button>
        ) : (
          <div className="ls-score-box">
            <div className="ls-score-msg">
              <strong>
                {score === parsedQuestions.length
                  ? "🎉 Outstanding! You mastered this topic."
                  : score >= 2
                  ? "👍 Great job! Review the explanations above."
                  : "📚 Good effort! Take a look at the explanations and retry."}
              </strong>
            </div>
            <button type="button" className="secondary-btn small" onClick={onReset}>
              <RefreshCw size={14} /> Try Another Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentRenderer({ content, action, onReset }) {
  if (action === "quiz") {
    return <QuizView content={content} onReset={onReset} />;
  }

  // Split code snippets from regular markdown text
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="ls-rendered-view">
      {parts.map((chunk, index) => {
        if (chunk.startsWith("```")) {
          const match = chunk.match(/^```(\w+)?\n([\s\S]*?)```$/);
          const lang = match ? match[1] || "code" : "code";
          const code = match ? match[2] : chunk.replace(/^```[\w]*\n?/, "").replace(/```$/, "");

          return (
            <div key={index} className="ls-code-block">
              <div className="ls-code-header">
                <span>{lang.toUpperCase()}</span>
                <button
                  type="button"
                  className="ls-copy-btn"
                  onClick={(e) => {
                    navigator.clipboard?.writeText(code);
                    const btn = e.currentTarget;
                    btn.innerText = "Copied!";
                    setTimeout(() => {
                      btn.innerText = "Copy";
                    }, 1500);
                  }}
                >
                  Copy
                </button>
              </div>
              <pre className="ls-code">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="ls-markdown-chunk"
            dangerouslySetInnerHTML={{
              __html: chunk
                .replace(/^### (.*$)/gim, '<h4 class="ls-h4">$1</h4>')
                .replace(/^## (.*$)/gim, '<h3 class="ls-h3">$1</h3>')
                .replace(/^# (.*$)/gim, '<h2 class="ls-h2">$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/^\s*[-•]\s+(.*)$/gim, "<li>$1</li>")
                .replace(/(<li>.*<\/li>)/gms, "<ul>$1</ul>")
                .replace(/\n\n/g, "<br/><br/>"),
            }}
          />
        );
      })}
    </div>
  );
}

export default function LearningStudio() {
  const [subjects, setSubjects] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [model, setModel] = useState("gemini-2.0-flash");
  const [selectedSubject, setSelectedSubject] = useState("Python Programming");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [action, setAction] = useState("explain");
  const [language, setLanguage] = useState("english");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);
  const [lastAction, setLastAction] = useState("explain");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizIteration, setQuizIteration] = useState(0);
  const [sessionStats, setSessionStats] = useState({ queries: 0, quizzesTaken: 0 });

  const resultContainerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getTutorSubjects()
      .then((res) => {
        if (!mounted) return;
        if (res?.subjects?.length) {
          setSubjects(res.subjects);
          setAiEnabled(Boolean(res.aiEnabled));
          if (res.model) setModel(res.model);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setSubjects(Object.keys(TOPIC_SUGGESTIONS));
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentTopicSuggestions = TOPIC_SUGGESTIONS[selectedSubject] || [];

  async function handleExecute() {
    const activeTopic = topic.trim() || currentTopicSuggestions[0] || "Foundations";
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await askTutor({
        subject: selectedSubject,
        topic: activeTopic,
        level,
        action,
        language,
        userInput: userInput.trim(),
      });

      setResult(response.reply);
      setLastAction(response.action || action);
      setSessionStats((prev) => ({
        queries: prev.queries + 1,
        quizzesquizzesTaken: action === "quiz" ? prev.quizzesTaken + 1 : prev.quizzesTaken,
      }));

      setTimeout(() => {
        resultContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    } catch (err) {
      setError(err.message || "Learning Studio tutor service could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ls-root">
      {/* Studio Header Strip */}
      <div className="ls-header">
        <div className="ls-pill">
          <Sparkles size={14} /> AI TRAINER &amp; LEARNING STUDIO
        </div>
        <h2 className="ls-title">
          Interactive Data &amp; AI <span>Learning Studio</span>
        </h2>
        <p className="ls-subtitle">
          Master industry-grade Data Science, Analytics, and Generative AI workflows with an interactive AI technical
          trainer inspired by Mohammed Nasim P's practical teaching curriculum.
        </p>

        <div className="ls-status-strip">
          <div className="ls-engine-badge">
            <span className={`ls-dot ${aiEnabled ? "online" : "offline"}`} />
            {aiEnabled ? `Gemini AI Engine Active (${model})` : "Local Knowledge Engine Active (Offline Mode)"}
          </div>
          {sessionStats.queries > 0 && (
            <div className="ls-counter-badge">
              <Layers size={13} /> {sessionStats.queries} Topics Explored
            </div>
          )}
        </div>
      </div>

      {/* 1. Subject Selector Cards */}
      <div className="ls-panel">
        <div className="ls-panel-header">
          <div>
            <h3>Step 1: Choose Your Specialization</h3>
            <p>Select any of the 10 data science, analytics, and AI subjects</p>
          </div>
          <span className="ls-badge">{subjects.length || 10} Subjects Available</span>
        </div>

        <div className="ls-subject-grid">
          {(subjects.length ? subjects : Object.keys(TOPIC_SUGGESTIONS)).map((sub, idx) => {
            const Icon = SUBJECT_ICONS[sub] || BookOpen;
            const colorClass = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
            const isSelected = selectedSubject === sub;

            return (
              <motion.button
                key={sub}
                type="button"
                className={`ls-subject-card ${colorClass} ${isSelected ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedSubject(sub);
                  setTopic("");
                  setResult(null);
                  setError("");
                }}
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="ls-subject-icon">
                  <Icon size={22} />
                </div>
                <span className="ls-subject-name">{sub}</span>
                {isSelected && <span className="ls-active-indicator" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Topic & Preferences Control Panel */}
      <div className="ls-panel ls-controls">
        <div className="ls-panel-header">
          <div>
            <h3>Step 2: Customize Topic &amp; Learning Mode</h3>
            <p>Configure depth, prompt action, and explanation language</p>
          </div>
          <div className="ls-lang-switch">
            <Globe size={14} />
            <button
              type="button"
              className={`ls-lang-btn ${language === "english" ? "active" : ""}`}
              onClick={() => setLanguage("english")}
            >
              English
            </button>
            <button
              type="button"
              className={`ls-lang-btn ${language === "malayalam" ? "active" : ""}`}
              onClick={() => setLanguage("malayalam")}
            >
              മലയാളം (Malayalam)
            </button>
          </div>
        </div>

        {/* Topic Input Field with quick suggestion pills */}
        <div className="ls-input-group">
          <label className="ls-label" htmlFor="ls-topic-input">
            Target Topic / Concept in <strong>{selectedSubject}</strong>:
          </label>
          <div className="ls-input-wrapper">
            <input
              id="ls-topic-input"
              className="ls-text-input"
              type="text"
              placeholder={`e.g., ${currentTopicSuggestions[0] || "Enter any concept"}...`}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleExecute()}
            />
            {topic && (
              <button type="button" className="ls-input-clear" onClick={() => setTopic("")}>
                ✕
              </button>
            )}
          </div>

          {currentTopicSuggestions.length > 0 && (
            <div className="ls-suggestions-tray">
              <span className="ls-tray-label">Quick topics:</span>
              <div className="ls-tray-chips">
                {currentTopicSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`ls-chip ${topic === item ? "active" : ""}`}
                    onClick={() => setTopic(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Difficulty Level & Action Selection */}
        <div className="ls-dual-row">
          <div className="ls-half">
            <label className="ls-label">Difficulty Level:</label>
            <div className="ls-segment-group">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  className={`ls-segment-btn ${level === lvl.id ? "active" : ""}`}
                  onClick={() => setLevel(lvl.id)}
                >
                  <span className="ls-segment-emoji">{lvl.emoji}</span>
                  <span>{lvl.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ls-half">
            <label className="ls-label">Teaching Action:</label>
            <div className="ls-actions-tray">
              {ACTIONS.map((act) => {
                const Icon = act.icon;
                const isSelected = action === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    className={`ls-action-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setAction(act.id)}
                  >
                    <Icon size={16} />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Submission Box for Review/Feedback Action */}
        <AnimatePresence>
          {action === "feedback" && (
            <motion.div
              className="ls-feedback-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="ls-label" htmlFor="ls-feedback-input">
                Paste your code, query, or conceptual answer for technical review:
              </label>
              <textarea
                id="ls-feedback-input"
                className="ls-textarea"
                rows={5}
                placeholder={`# Paste your ${selectedSubject} code or explanation here for feedback\ndef solution():\n    pass`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Execute Action Button */}
        <div className="ls-launch-bar">
          <button
            type="button"
            className="primary-btn ls-submit-btn"
            onClick={handleExecute}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} /> Consulting AI Trainer...
              </>
            ) : (
              <>
                Launch {ACTIONS.find((a) => a.id === action)?.label || "Lesson"} <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="ls-error-banner">
          <AlertCircle size={18} />
          <div>
            <strong>Trainer Notice:</strong> {error}
          </div>
        </div>
      )}

      {/* 3. Output & Interactive Experience Area */}
      <div ref={resultContainerRef}>
        <AnimatePresence>
          {result && (
            <motion.div
              className="ls-panel ls-result-container"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <div className="ls-result-topbar">
                <div className="ls-meta-tags">
                  <span className="ls-badge cyan">{selectedSubject}</span>
                  <span className="ls-badge violet">{topic || currentTopicSuggestions[0]}</span>
                  <span className="ls-badge blue">{level.toUpperCase()}</span>
                  {language === "malayalam" && <span className="ls-badge green">മലയാളം</span>}
                </div>

                <div className="ls-result-controls">
                  <button
                    type="button"
                    className="secondary-btn small"
                    onClick={() => {
                      setQuizIteration((prev) => prev + 1);
                      handleExecute();
                    }}
                    title="Regenerate with fresh examples"
                  >
                    <RefreshCw size={14} /> Refresh
                  </button>
                  <button
                    type="button"
                    className="ls-dismiss-btn"
                    onClick={() => setResult(null)}
                    title="Clear view"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="ls-result-body">
                <ContentRenderer
                  key={`${quizIteration}-${lastAction}`}
                  content={result}
                  action={lastAction}
                  onReset={() => {
                    setQuizIteration((prev) => prev + 1);
                    handleExecute();
                  }}
                />
              </div>

              {/* Next Steps Roadmapping */}
              <div className="ls-result-footer">
                <div className="ls-next-path">
                  <Lightbulb size={16} />
                  <span>
                    Ready to practice further? Test your skills with another action like{" "}
                    <strong>{lastAction === "quiz" ? "Interview Practice" : "Quiz Me"}</strong> or connect with Mohammed
                    Nasim for deep-dive classroom sessions.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
