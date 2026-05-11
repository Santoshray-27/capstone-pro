# PROJECT OVERVIEW — ResumeXpert AI

---

## 📌 What Is This Project?

**ResumeXpert AI** is a comprehensive, AI-powered "Career OS" designed to modernize the job search experience. It serves as a 24/7 personal career coach that helps job seekers navigate the complex landscape of modern recruitment through data-driven insights and AI-led simulations.

---

## 🧩 Problem This Project Solves

The modern job market is controlled by **ATS (Applicant Tracking Systems)** — automated algorithms that filter out up to 75% of resumes before they ever reach a human recruiter.

### Real problems faced by job seekers:
- 📉 **The Black Hole:** Submitting resumes without knowing how they are scored or why they are rejected.
* 🏗️ **Formatting Pitfalls:** Using creative layouts that break ATS parsers.
* 🎤 **Preparation Gap:** Entering interviews without practicing role-specific, behavioral questions.
* 📊 **Skill Blindness:** Not knowing exactly which technical or soft skills are missing for a target role.

ResumeXpert AI provides the visibility and tools needed to overcome these barriers.

---

## 👥 Target Users

| User Type | What They Can Do |
|-----------|-----------------|
| **Job Seeker** | Full access to parsing, ATS scoring, resume building, job matching, and AI interviews |
| **Guest User** | Instant, one-click access to demo the core platform features |
| **Admin** | Monitor platform engagement and system-wide statistics |

---

---

## 🏗️ Main Modules / Features

### 1. 🔐 Authentication System
- Register with name, email, password
- Login with email/password → JWT issued
- Guest login for instant demo access (Job Seeker role)
- Role system: `jobseeker`, `admin`

### 2. 📤 Smart Resume Parsing
- Upload PDF or DOCX files (max 10MB)
- Auto-extract: name, email, phone, skills, experience, education with 99% accuracy
- Text stored as `rawText` and structured `parsedData` in MongoDB

### 3. 🧠 Deep AI ATS Analysis
- Simulates 50+ enterprise ATS platforms
- Returns: `atsScore` (0–100), score breakdown, strengths, weaknesses, missing skills, keyword analysis
- AI chain: Google Gemini (Primary) → OpenAI → Groq (Fallback)

### 4. 📝 Premium Resume Builder
- 6 industry-standard, ATS-optimized templates
- Live Markdown-style preview and pixel-perfect PDF export via `html2pdf.js`

### 5. 💼 Intelligent Job Matcher
- Semantic matching engine generates 5 job recommendations based on resume profile
- Real-time job search via API integrations

### 6. 🎤 AI Mock Interviews (Coach Mode)
- Practice with contextual, resume-based questions
- Choose experience level and interview type (Technical / Behavioral / Mixed)
- Real-time evaluation: AI scores each answer and provides model responses

### 7. 📊 Career Analytics Dashboard
- Track total resumes, analyses, interviews, and average ATS score
- Visuals: score over time, skills radar, interview performance tracking

### 8. 🔍 Skill Gap Analyzer
- Compare current resume vs. target role requirements
- AI-generated learning path and certification recommendations

### 9. 🌊 Interactive Landing Page
- **Feature Marquee:** Infinite-scrolling strip of core platform capabilities
- **Stacked Cards:** High-density feature showcase with sticky stacking animations
- **Dynamic Theme:** Responsive colors and premium typography (Inter / JetBrains Mono)

### 10. 💬 Integrated Feedback
- Submit platform reviews, bug reports, or feature requests
- Star ratings and anonymous submission support

---

## ⚙️ High-Level Working Explanation

```
User → Browser (React) → API calls (Axios) → Express Backend (Node.js)
                                               ↓
                                         MongoDB (Mongoose)
                                               ↓
                                      AI Services (Gemini/OpenAI/Groq)
```

1. **User opens the app** → React SPA loads from Vite dev server (or dist folder in production).
2. **Authentication** → JWT stored in `localStorage`. Every API request attaches `Authorization: Bearer <token>`.
3. **Resume Upload** → `multipart/form-data` sent to `/api/resumes/upload` → Multer saves file → `resumeParser.js` extracts text → MongoDB stores result.
4. **AI Analysis** → `/api/analysis/analyze/:resumeId` → `aiService.js` builds a prompt → calls Gemini (primary) → if fails, tries OpenAI → if fails, tries Groq → parses JSON response → stores in `Analysis` model.
5. **Interview** → Frontend calls `/api/interviews/create` → AI generates questions → stores in `Interview` model → user answers one by one → each answer is evaluated by AI.
6. **Dashboard** → Aggregates data from User, Resume, Analysis, Interview collections.

---

## 📋 Summary

ResumeXpert AI is a comprehensive career acceleration platform. It uses a classic MERN stack enhanced with a multi-provider AI fallback system (Gemini → OpenAI → Groq) to ensure high availability. The frontend is a modern React SPA featuring a high-density "Career OS" design, and the backend is a modular Express REST API. The system is designed for production deployment with PM2 and supports seamless cloud hosting.

---

*Next: See [TECH_STACK.md](./TECH_STACK.md) for a detailed breakdown of every technology used.*
