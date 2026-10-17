// Single source of truth for the portfolio content.
// Imported by the React front-end AND by the Express API server (server/),
// so the site and the API can never drift apart.

const cover = (prompt, size = "landscape_16_9") =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${prompt}&image_size=${size}&cb=${Date.now()}`;

export const portfolio = {
  name: "Mohammed Nasim P",
  role: "Data Science & AI Trainer | Data Analyst | Generative AI Developer",
  email: "nasimparammel@gmail.com",
  phone: "9656759202",
  location: "Malappuram, Kerala, India",
  linkedin: "https://www.linkedin.com/in/mohammednasimpdatascientist/",
  github: "https://github.com/mohammednasim",
  resume: "/assets/Mohammed-Nasim-Resume.pdf",
  avatar: "/assets/nasim-character-2d.png",
  availability: "Open to Data Science, Analytics & AI roles",
  summary:
    "I am a Data Science and Data Analytics Trainer and AI Developer focused on transforming data into actionable insights and building practical AI-powered applications. I work at the intersection of Data Science, Analytics, and Artificial Intelligence — training learners in practical data and AI technologies while building applications and analytical solutions that turn technical concepts into useful outcomes.",
  identity: [
    "Data Science Trainer",
    "Data Analytics Trainer",
    "Data Analyst",
    "Machine Learning & AI Practitioner",
    "Generative AI & Agentic AI Developer",
    "Freelance Data & AI Solutions Developer",
  ],
  marquee: [
    "Python",
    "SQL",
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "Keras",
    "PyTorch",
    "Power BI",
    "Tableau",
    "LangChain",
    "LangGraph",
    "RAG",
    "Google Gemini",
    "OpenAI API",
    "Streamlit",
    "OpenCV",
    "Git",
  ],
  experience: [
    {
      period: "May 2025 — Present",
      title: "Data Scientist & AI Trainer",
      company: "Softroniics, Ernakulam, India",
      current: true,
      bullets: [
        "Delivered instructor-led training in Python, SQL, Machine Learning, Deep Learning, Power BI, and Natural Language Processing (NLP).",
        "Designed and developed hands-on Data Science and AI projects to enhance practical learning and problem-solving skills.",
        "Performed data preprocessing, feature engineering, exploratory data analysis (EDA), and model evaluation using real-world datasets.",
        "Built demonstration applications using Python, Streamlit, LangChain, LangGraph, and Google Gemini to introduce modern AI concepts.",
        "Mentored students through project development, coding best practices, and technical interview preparation.",
        "Conducted code reviews, mock interviews, and technical sessions to improve learners' industry readiness.",
      ],
    },
    {
      period: "Sep 2024 — Dec 2024",
      title: "Data Science & Gen AI Intern",
      company: "Innomatics Research Labs, India (Remote)",
      bullets: [
        "Performed data preprocessing, feature selection, and model training on real-world datasets.",
        "Built and tuned machine learning models to improve prediction performance.",
        "Generated evaluation reports and visualizations to communicate insights.",
      ],
    },
  ],
  education: {
    period: "Jan 2021 — May 2025",
    degree: "B.E. Computer Science and Engineering",
    institution: "Bethlehem Institute of Engineering, Kanniyakumari, India",
    gpa: "7.3",
  },
  skills: [
    {
      category: "Programming & Data Processing",
      icon: "code",
      color: "cyan",
      items: ["Python", "SQL", "Pandas", "NumPy"],
    },
    {
      category: "Data Visualization & BI",
      icon: "chart",
      color: "blue",
      items: ["Excel", "Power BI", "Tableau", "Matplotlib", "Seaborn"],
    },
    {
      category: "Machine Learning & Deep Learning",
      icon: "brain",
      color: "violet",
      items: [
        "Scikit-learn",
        "Regression",
        "Classification",
        "Clustering",
        "Model Evaluation",
        "TensorFlow",
        "Keras",
        "PyTorch",
      ],
    },
    {
      category: "Generative AI",
      icon: "sparkles",
      color: "cyan",
      items: [
        "LLM Applications",
        "RAG",
        "LangChain",
        "LangGraph",
        "Embeddings",
        "Vector Search",
        "Prompt Engineering",
        "Agentic AI",
      ],
    },
    {
      category: "Computer Vision & Development",
      icon: "eye",
      color: "violet",
      items: ["OpenCV", "Streamlit", "Flask", "Git", "GitHub"],
    },
  ],
  services: [
    {
      title: "Data Analytics & EDA",
      description:
        "Exploratory data analysis, data cleaning, and insight generation to uncover patterns and support data-driven decisions.",
      icon: "bar-chart",
    },
    {
      title: "Excel & Power BI Dashboards",
      description:
        "Interactive dashboards and reports with DAX, KPIs, slicers, and drill-through to visualize business performance.",
      icon: "dashboard",
    },
    {
      title: "Machine Learning Models",
      description:
        "End-to-end model development — from data preprocessing and feature engineering to evaluation and deployment-ready pipelines.",
      icon: "brain",
    },
    {
      title: "AI-Powered Applications",
      description:
        "Custom AI applications using LLMs, agents, and modern frameworks to automate tasks and enhance workflows.",
      icon: "bot",
    },
    {
      title: "RAG & Document Intelligence",
      description:
        "Retrieval-Augmented Generation systems for document question answering, semantic search, and knowledge extraction.",
      icon: "database",
    },
    {
      title: "Python Automation",
      description:
        "Automated scripts and workflows to streamline repetitive tasks, data pipelines, and office operations.",
      icon: "code",
    },
    {
      title: "Data Science & AI Training",
      description:
        "Instructor-led training and workshops on Python, SQL, Machine Learning, Power BI, NLP, and Generative AI.",
      icon: "graduation",
    },
    {
      title: "Project Mentoring",
      description:
        "Technical guidance, code reviews, and mentorship for data science and AI project development.",
      icon: "users",
    },
  ],
  projects: [
    {
      id: "smartofficeai",
      number: "01",
      title: "SmartOfficeAI",
      category: "ai",
      categoryLabel: "Agentic AI / Generative AI",
      featured: true,
      description:
        "An Agentic AI-powered office assistant built with Python, LangChain, LangGraph, Gemini, RAG, and Streamlit. It combines conversational AI with office automation — document question answering, email automation, calendar event creation, intelligent intent detection, and persistent memory.",
      details: [
        "Agentic AI conversational assistant with intent detection and task routing via LangGraph.",
        "Retrieval-Augmented Generation (RAG) for document question answering and semantic search using ChromaDB.",
        "Short-term and long-term memory managed with SQLite.",
        "Email automation through integrated email tools.",
        "Calendar event creation from natural-language instructions.",
        "Interactive Streamlit web interface for conversational workflow automation.",
      ],
      stack: [
        "Python",
        "LangChain",
        "LangGraph",
        "Google Gemini",
        "RAG",
        "ChromaDB",
        "SQLite",
        "Streamlit",
      ],
      github: "https://github.com/mohammednasim/SmartOfficeAI",
      demo: null,
      color: "cyan",
      image: "/assets/projects/smartofficeai.jpg",
    },
    {
      id: "ai-code-reviewer",
      number: "02",
      title: "AI Code Reviewer",
      category: "ai",
      categoryLabel: "Generative AI / Developer Tools",
      featured: false,
      description:
        "A Python-based GenAI application that helps developers review and improve their code. By integrating OpenAI's API, users can submit their Python code and receive detailed feedback on potential bugs, errors, and areas for improvement.",
      details: [
        "OpenAI API integration for AI-powered code analysis.",
        "Detects potential bugs and errors in submitted Python code.",
        "Provides actionable suggestions for code improvement.",
        "Designed to support cleaner, more reliable code.",
      ],
      stack: ["Python", "OpenAI API", "Streamlit"],
      github: "https://github.com/mohammednasim/AI-Code-Reviewer",
      demo: null,
      color: "violet",
      image: "/assets/projects/ai-code-reviewer.jpg",
    },
    {
      id: "image-processing",
      number: "03",
      title: "AI-Powered Image Processing App",
      category: "ml",
      categoryLabel: "Computer Vision / Image Processing",
      featured: false,
      description:
        "A Streamlit web application offering advanced image processing capabilities in a simple, interactive interface. The app leverages YOLOv5 for object detection and Tesseract OCR for text extraction from images.",
      details: [
        "Object detection powered by YOLOv5.",
        "Text extraction from images using Tesseract OCR.",
        "Interactive Streamlit interface for image uploads and processing.",
        "Built for both technical users and casual users.",
      ],
      stack: ["Python", "Streamlit", "YOLOv5", "Tesseract OCR", "OpenCV"],
      github:
        "https://github.com/mohammednasim/AI-Powered-Image-Processing-App",
      demo: null,
      color: "blue",
      image: "/assets/projects/image-processing.jpg",
    },
    {
      id: "chicken-disease",
      number: "04",
      title: "Chicken Disease Classification",
      category: "ml",
      categoryLabel: "Deep Learning / Computer Vision",
      featured: true,
      description:
        "A deep-learning image classification project focused on identifying diseases in chickens from images. The project applies convolutional neural network (CNN) techniques to classify poultry health conditions, supporting early disease detection.",
      details: [
        "Image classification pipeline for chicken disease identification.",
        "Deep learning model trained on poultry image data.",
        "Data preprocessing and augmentation for model training.",
        "Supports early disease detection through automated image analysis.",
      ],
      stack: ["Python", "TensorFlow", "Keras", "CNN", "OpenCV"],
      github:
        "https://github.com/mohammednasim/Chicken-Disease-Classification-Projects-main",
      demo: null,
      color: "violet",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20poultry%20health%20monitoring%20AI%20dashboard,%20showing%20CNN%20image%20classification%20of%20chickens%20with%20glowing%20health%20status%20indicators,%20neural%20network%20architecture%20visualization,%20dark%20agritech%20theme,%20violet%20and%20cyan%20neon%20accents,%208k%20resolution,%20no%20text."
      ),
    },
    {
      id: "insurance-fraud",
      number: "05",
      title: "Insurance Fraud Detection",
      category: "ml",
      categoryLabel: "Machine Learning",
      featured: false,
      description:
        "A machine learning solution to identify potentially fraudulent insurance claims using classification algorithms and predictive analytics, supporting data-driven claim verification.",
      details: [
        "Data preparation and feature-focused modeling workflow.",
        "Random Forest and XGBoost classification model development.",
        "Evaluation using Precision, Recall, F1-Score, and ROC-AUC.",
        "Designed to support claim verification and reduce false positives.",
      ],
      stack: ["Python", "Scikit-learn", "Random Forest", "XGBoost"],
      github: "https://github.com/mohammednasim/-Insurance-Fraud-Claim-Detection-System",
      demo: null,
      color: "blue",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20fraud%20detection%20analytics%20dashboard,%20glowing%20red%20anomaly%20detection%20flags%20on%20insurance%20claim%20data%20visualizations,%20Random%20Forest%20and%20XGBoost%20model%20metrics,%20dark%20financial%20security%20theme,%20blue%20and%20cyan%20accents,%208k%20resolution,%20no%20text."
      ),
    },
    {
      id: "ipl-analysis",
      number: "06",
      title: "IPL Analysis with Power BI",
      category: "bi",
      categoryLabel: "Data Analytics / Sports Analytics",
      featured: true,
      description:
        "A comprehensive Power BI dashboard for IPL cricket analytics. It uncovers player performance patterns, team dynamics, and match strategies through in-depth statistical analysis, fostering data-driven decision-making in cricket.",
      details: [
        "Dynamic dashboards for real-time match performance tracking.",
        "Intuitive visualizations spotlighting player and team statistics.",
        "Data integration for comprehensive and holistic insights.",
        "Uncovers patterns to support strategic game planning.",
      ],
      stack: ["Power BI", "DAX", "Data Modeling", "Sports Analytics"],
      github: "https://github.com/mohammednasim/IPL-Analysis-with-PowerBI",
      demo: null,
      color: "cyan",
      image: cover(
        "Website%20project%20cover:%20Professional%20IPL%20cricket%20analytics%20dashboard,%20featuring%20a%203D%20cricket%20stadium%20silhouette%20with%20glowing%20neon%20data%20visualizations,%20player%20stat%20panels,%20and%20statistical%20charts,%20dark%20navy%20theme%20with%20cyan%20and%20violet%20accents,%20cinematic%20lighting,%20no%20text."
      ),
    },
    {
      id: "ai-exam-analysis",
      number: "07",
      title: "AI Exam Analysis",
      category: "ai",
      categoryLabel: "AI / Educational Data Analytics",
      featured: true,
      description:
        "An AI-assisted exam analytics system that processes examination and result data to surface performance patterns across students, subjects, and individual questions. Raw answer and score data is turned into clear, actionable insight that supports data-driven academic decisions and targeted improvement.",
      details: [
        "Processes exam and result datasets into structured analytical views.",
        "Student-level, subject-level, and question-level performance breakdowns.",
        "Statistical analysis and visualization of score distributions and trends.",
        "Highlights weak areas to support targeted academic intervention.",
        "Built as a reusable Python analysis pipeline.",
      ],
      stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Data Visualization"],
      github: "https://github.com/mohammednasim/AI_EXAM_ANALYSIS",
      demo: null,
      color: "cyan",
      image: cover(
        "Website%20project%20cover:%20Intelligent%20educational%20analytics%20dashboard,%20holographic%20answer%20sheets%20with%20glowing%20exam%20score%20distributions,%20student%20progress%20charts%20and%20performance%20heatmaps,%20dark%20futuristic%20classroom%20aesthetic,%20cyan%20and%20violet%20neon%20accents,%20high%20quality,%20no%20text."
      ),
    },
    {
      id: "stock-market-analysis",
      number: "08",
      title: "Stock Market Analysis & Prediction",
      category: "ml",
      categoryLabel: "Machine Learning / Financial Analytics",
      featured: false,
      description:
        "A stock market analytics and price-prediction project built on historical market data. It explores price movement, volatility, and trend behaviour, then applies machine learning and time-series techniques to forecast future prices, with visual reporting of model behaviour.",
      details: [
        "Historical stock price ingestion, cleaning, and feature engineering.",
        "Exploratory analysis of trends, moving averages, and volatility.",
        "Machine learning / time-series modelling for price prediction.",
        "Model evaluation and visualization against actual market movement.",
        "Reusable notebook-driven workflow for any listed ticker.",
      ],
      stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib", "Time Series"],
      github: "https://github.com/mohammednasim/StockMarket_Analyse",
      demo: null,
      color: "blue",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20stock%20market%20prediction%20dashboard,%20glowing%20candlestick%20charts,%20predictive%20trend%20lines%20and%20volatility%20heatmaps,%20time-series%20analysis%20visualizations,%20dark%20fintech%20theme,%20blue%20and%20cyan%20accents,%208k%20resolution,%20no%20text."
      ),
    },
    {
      id: "car-sales",
      number: "09",
      title: "Car Sales Power BI Dashboard",
      category: "bi",
      categoryLabel: "Business Intelligence",
      featured: false,
      description:
        "An interactive Power BI dashboard for car sales business analysis. Uses DAX, KPIs, slicers, drill-through reports, and Power Query transformations to deliver insights into sales trends and performance.",
      details: [
        "Data cleaning, transformation, and modeling with Power Query.",
        "DAX measures and KPI-driven reporting.",
        "Interactive slicers and drill-through reports.",
        "Insights into sales trends, product performance, and revenue growth.",
      ],
      stack: ["Power BI", "DAX", "Power Query", "Data Modeling", "KPIs"],
      github: "https://github.com/mohammednasim/-Car-Sales-PowerBI-Dashboard",
      demo: null,
      color: "blue",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20modern%20Car%20Sales%20Power%20BI%20dashboard%20on%20a%20sleek%20tablet,%20featuring%20dark%20mode%20UI,%20glowing%20cyan%20and%20violet%20line%20charts,%20bar%20graphs,%20and%20KPI%20cards,%20high-end%20luxury%20car%20silhouettes%20in%20the%20background,%20ultra-realistic,%208k%20resolution,%20cinematic%20lighting,%20no%20text."
      ),
    },
    {
      id: "sales-report",
      number: "10",
      title: "Sales Report Dashboard — Power BI",
      category: "bi",
      categoryLabel: "Data Analytics / Business Intelligence",
      featured: false,
      description:
        "A Power BI retail sales dashboard providing analytical reporting on sales performance. Built to visualize key sales metrics and trends for business decision-making.",
      details: [
        "Retail sales data modeling and reporting.",
        "Key sales metrics and trend visualizations.",
        "Interactive dashboard for performance analysis.",
        "Supports data-driven business decisions.",
      ],
      stack: ["Power BI", "DAX", "Data Modeling", "Retail Analytics"],
      github:
        "https://github.com/mohammednasim/Sales-Report-Dashboard---Power-BI",
      demo: null,
      color: "violet",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20retail%20sales%20report%20dashboard,%20glowing%20KPI%20cards,%20revenue%20trends%20and%20product%20performance%20charts%20floating%20above%20a%20dark%20minimalist%20desk,%20navy%20background%20with%20violet%20and%20cyan%20neon%20accents,%208k%20resolution,%20no%20text."
      ),
    },
    {
      id: "spotify",
      number: "11",
      title: "Spotify Project on Power BI",
      category: "bi",
      categoryLabel: "Data Analytics / Media Analytics",
      featured: false,
      description:
        "A Power BI analytics project on Spotify music data. Analyzes the spotify-2023 dataset with a Python data pipeline and cover URL enrichment, visualized through an interactive media analytics dashboard.",
      details: [
        "Analysis of the Spotify 2023 music dataset.",
        "Python script (SpotifyScript.py) for data processing and cover URL enrichment.",
        "Power BI dashboard for music analytics and trends.",
        "Visual insights into tracks, streams, and artist performance.",
      ],
      stack: ["Power BI", "Python", "Data Visualization", "Media Analytics"],
      github: "https://github.com/mohammednasim/Spotify-Project-on-Power-BI",
      demo: null,
      color: "cyan",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20Spotify%20media%20analytics%20dashboard%20on%20a%20sleek%20laptop%20screen,%20featuring%20dark%20mode%20glassmorphism%20UI,%20glowing%20green%20and%20cyan%20sound%20wave%20visualizations,%20artist%20popularity%20charts,%20and%20track%20streaming%20data,%20music-themed%20background%20with%20abstract%20vinyl%20records,%20ultra-realistic,%208k%20resolution,%20cinematic%20lighting,%20no%20text."
      ),
    },
    {
      id: "legal-document-ai",
      number: "12",
      title: "Legal Document AI",
      category: "ai",
      categoryLabel: "Generative AI / Legal Tech (RAG)",
      featured: false,
      description:
        "A Retrieval-Augmented Generation assistant for legal documents. It indexes contracts, agreements, and legal text so users can ask everyday-language questions and receive grounded answers with the supporting source passages — turning long, dense documents into a searchable knowledge base. (Private repository — source code is not publicly accessible.)",
      details: [
        "Document ingestion and chunking pipeline for contracts and legal text.",
        "Vector embeddings with semantic search over the indexed documents.",
        "RAG-based question answering grounded in retrieved source passages.",
        "Conversational interface for exploring long documents quickly.",
        "Private project — repository is not publicly accessible.",
      ],
      stack: ["Python", "LangChain", "RAG", "Vector Search", "LLM", "Streamlit"],
      github: null,
      demo: null,
      color: "violet",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20a%20Legal%20AI%20assistant%20interface,%20glowing%20holographic%20contract%20documents%20with%20semantic%20search%20highlights,%20RAG-based%20source%20passage%20linking,%20dark%20navy%20legal%20tech%20theme,%20violet%20and%20cyan%20accents,%208k%20resolution,%20no%20text."
      ),
    },
    {
      id: "eventvisualshub",
      number: "13",
      title: "EventVisualsHub",
      category: "ml",
      categoryLabel: "Computer Vision / AI Applications",
      featured: false,
      private: true,
      description:
        "The Event Visual Gallery captures and organizes event images and videos, leveraging AI for facial recognition and emotion analysis. Users can create customizable albums with unique backgrounds and models, and uploaded event videos are analyzed to generate concise summaries and transcriptions. (Private repository — source code is not publicly accessible.)",
      details: [
        "Organize event images and videos into customizable albums.",
        "Facial recognition for automatic person grouping.",
        "Emotion analysis across event media.",
        "Video summarization and transcription for uploaded event footage.",
        "Private project — repository is not publicly accessible.",
      ],
      stack: [
        "Python",
        "OpenCV",
        "Face Recognition",
        "Emotion Analysis",
        "Computer Vision",
      ],
      github: null,
      demo: null,
      color: "violet",
      image: cover(
        "Website%20project%20cover:%20Professional%203D%20isometric%20view%20of%20an%20AI-powered%20event%20media%20gallery,%20glowing%20facial%20recognition%20frames%20and%20emotion%20analysis%20tags%20on%20event%20photos,%20video%20summarization%20timeline,%20dark%20tech%20theme,%20violet%20and%20cyan%20neon%20accents,%208k%20resolution,%20no%20text."
      ),
    },
  ],
  projectCategories: [
    { id: "all", label: "All Projects" },
    { id: "ai", label: "AI Engineering & Generative AI" },
    { id: "ml", label: "Machine Learning & Computer Vision" },
    { id: "bi", label: "Data Analytics & Business Intelligence" },
  ],
  certifications: [
    ["Data Science & AI", "Avodha Edutech Pvt Ltd", "2024"],
    ["SQL Certification Course", "Oracle", "2024"],
    ["Oracle Cloud Infrastructure Certified", "Oracle", "2023"],
    ["Front End Development Libraries", "Additional Training", ""],
    ["Responsive Web Design", "Additional Training", ""],
    ["Foundations Associate", "Additional Training", ""],
    ["Soft Skill Development Program", "Additional Training", ""],
  ],
  achievements: [
    ["🏆", "Winner", "National Level Technical Symposium"],
    ["💡", "Participant", "Smart India Hackathon 2023"],
    ["⚡", "Simulations", "Forage — GenAI, Data Analytics, Power BI"],
  ],
};

export default portfolio;
