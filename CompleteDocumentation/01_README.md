# 🚀 ResumeXpert AI — Documentation Hub

## Project Name
**ResumeXpert AI**
*Analyze. Optimize. Prepare. Get Hired.*

---

## 📌 Short Overview

ResumeXpert AI is a **modern, AI-driven career acceleration platform** built on the MERN stack. It empowers job seekers by providing deep, real-time insights into their resumes, simulating high-pressure interviews, and bridging skill gaps to secure dream roles in competitive markets.

---

## 🎯 Main Purpose

> **Problem:** Job seekers often submit resumes into a "black hole," unaware of how ATS (Applicant Tracking Systems) score them or why they aren't landing interviews.
>
> **Solution:** ResumeXpert AI provides a "Career OS" — an all-in-one intelligence suite that parses resumes with 99% accuracy, generates enterprise-grade ATS scores, and provides a 24/7 AI interview coach.

---

## ✨ Key Features

| Feature | What It Does |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based access with instant Guest Demo modes |
| 📄 **Smart Parsing** | Instant data extraction from PDF/DOCX using OCR and AI |
| 🧠 **Deep ATS Scoring** | Detailed analysis simulating 50+ enterprise ATS platforms |
| 🏗️ **Dynamic Builder** | 6 premium ATS-optimized templates with live preview and PDF export |
| 💼 **Job Matcher** | Semantic matching engine that finds roles based on your skill footprint |
| 🎤 **AI Mock Interviews** | Practice with contextual, resume-based questions and instant feedback |
| 📊 **Career Analytics** | High-density dashboard tracking score trends and skill growth |
| 🔍 **Skill Gap Analyzer** | AI-driven roadmap to bridge the gap between you and your target role |
| 🌊 **Feature Marquee** | Dynamic, infinite-scrolling marquee showcasing core platform capabilities |
| 🃏 **Stacked Cards** | Interactive, high-density landing page with sticky card animations |

---

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Recharts, Lucide-React, Three.js |
| **Backend** | Node.js, Express.js 4 (MVC Architecture) |
| **Database** | MongoDB, Mongoose ODM 8 |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **File Handling** | Multer (disk storage), pdf-parse, mammoth |
| **AI Integration** | Google Gemini 2.0 Flash, OpenAI GPT-3.5, Groq (LLaMA 3.1) |
| **HTTP Client** | Axios (frontend), node-fetch (backend) |
| **Dev Tools** | Nodemon, ESLint, PostCSS, Autoprefixer |
| **Deployment** | PM2 ecosystem config included |

---

## 📁 Documentation Index

| File | Description |
|------|-------------|
| [README.md](./README.md) | This file — project overview and index |
| [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) | What the project does, who it's for, key modules |
| [TECH_STACK.md](./TECH_STACK.md) | All technologies, why and where each is used |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Full folder tree with explanation of every file |
| [APPLICATION_FLOW.md](./APPLICATION_FLOW.md) | End-to-end flow with Mermaid diagrams |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, patterns, state management |
| [SETUP_AND_RUN.md](./SETUP_AND_RUN.md) | Installation, environment setup, run commands |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | All `.env` variables explained |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | All REST API endpoints documented |
| [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md) | MongoDB models, fields, relationships, ER diagram |
| [COMPONENTS_OR_MODULES.md](./COMPONENTS_OR_MODULES.md) | All frontend components and backend modules |
| [FILE_BY_FILE_EXPLANATION.md](./FILE_BY_FILE_EXPLANATION.md) | Purpose and connections of every source file |
| [LINE_BY_LINE_EXPLANATION.md](./LINE_BY_LINE_EXPLANATION.md) | Block-by-block code explanation for key files |
| [CONFIG_FILES_EXPLANATION.md](./CONFIG_FILES_EXPLANATION.md) | All config files explained |
| [DEPENDENCY_EXPLANATION.md](./DEPENDENCY_EXPLANATION.md) | Every dependency and devDependency explained |
| [SECURITY.md](./SECURITY.md) | Auth, validation, API security, secrets handling |
| [ERROR_HANDLING_AND_VALIDATION.md](./ERROR_HANDLING_AND_VALIDATION.md) | Error flow, validation logic, suggestions |
| [TESTING_DOCUMENTATION.md](./TESTING_DOCUMENTATION.md) | Current test status and recommendations |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | How to deploy to production |
| [IMPROVEMENTS_AND_RECOMMENDATIONS.md](./IMPROVEMENTS_AND_RECOMMENDATIONS.md) | Suggestions for better code and architecture |
| [GLOSSARY.md](./GLOSSARY.md) | Beginner-friendly definitions of technical terms |
| [FULL_PROJECT_DOCUMENTATION.md](./FULL_PROJECT_DOCUMENTATION.md) | Complete combined project report |

---

## 🚀 Quick Start

```bash
# 1. Install backend
cd backend && npm install

# 2. Configure backend environment
cp .env.example .env
# Edit .env with your MongoDB URI and AI API keys

# 3. Install frontend
cd ../frontend && npm install

# 4. Start both servers
cd backend && npm run dev   # Terminal 1 → http://localhost:5000
cd frontend && npm run dev  # Terminal 2 → http://localhost:5173
```

---

## 📄 License
MIT License — Built for learning and production use.
