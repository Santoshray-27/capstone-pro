# PROJECT STRUCTURE — ResumeXpert AI

This document provides a complete, hierarchical tree view of the **ResumeXpert AI** project. 

> [!NOTE]
> ResumeXpert AI is designed for **Dual-Repository Architecture**. While the folder structure below shows a unified view (recommended for local development), the `backend/` and `frontend/` directories are fully independent and should be pushed to separate Git repositories for production deployment.

---

## 📁 Unified Root: `Resume/`

```
Resume/                                  ← Project root (named "Resume" on disk)
├── .git/                                ← Git version control (IGNORED in docs)
├── .gitignore                           ← Files/folders excluded from git
├── README.md                            ← Original project README
├── backend/                             ← Node.js + Express API server
├── frontend/                            ← React + Vite SPA
├── Olddocument/                         ← Previous documentation (legacy)
├── CompleteDocumentation/               ← This documentation folder
├── AI Career Accelerator Platform*.html ← Standalone HTML PRD viewer
├── AI Career Accelerator Platform*.docx ← Word document PRDs
├── convert_html_to_docx.ps1            ← PowerShell script for docx conversion
└── convert_prd_to_docx.js              ← Node.js script for docx conversion
```

> **Note:** `.git/### 📁 Backend Directory: `backend/`

```
backend/
├── .env                                 ← Real environment variables
├── .env.example                         ← Template for env variables
├── package.json                         ← Backend dependencies and scripts
├── server.js                            ← ⭐ Main entry point — Express app bootstrap
│
├── controllers/                         ← Business logic handlers (C in MVC)
│   ├── auth.controller.js               ← Register, login, guest-login, profile
│   ├── resume.controller.js             ← Upload, parse, list, delete resumes
│   ├── analysis.controller.js           ← Trigger AI analysis, retrieve results
│   ├── job.controller.js                ← Job aggregator + AI matching
│   ├── interview.controller.js          ← Create sessions, submit/evaluate answers
│   ├── feedback.controller.js           ← Submit and retrieve feedback
│   └── dashboard.controller.js          ← User analytics aggregation
│
├── models/                              ← MongoDB schemas (M in MVC)
│   ├── User.model.js                    ← User: auth, profile, stats, roles
│   ├── Resume.model.js                  ← Resume: file info, parsed content, ATS score
│   ├── Analysis.model.js                ← AI analysis results, score breakdown
│   ├── Interview.model.js               ← Interview sessions with questions + evaluations
│   └── Feedback.model.js                ← User feedback with ratings
│
├── routes/                              ← Route definitions
│   ├── auth.routes.js                   ← /api/auth/* endpoints
│   ├── resume.routes.js                 ← /api/resumes/* endpoints
│   ├── analysis.routes.js               ← /api/analysis/* endpoints
│   ├── job.routes.js                    ← /api/jobs/* endpoints
│   ├── interview.routes.js              ← /api/interviews/* endpoints
│   ├── feedback.routes.js               ← /api/feedback/* endpoints
│   └── dashboard.routes.js              ← /api/dashboard/* endpoints
│
└── utils/                               ← Utility/helper functions
    ├── aiService.js                     ← ⭐ Core AI: Gemini, OpenAI, Groq fallback
    ├── resumeParser.js                  ← PDF/DOCX text extraction
    └── generateToken.js                 ← JWT token generation
```

---

### 📁 Frontend Directory: `frontend/`

```
frontend/
├── index.html                           ← Root HTML shell
├── vite.config.js                       ← Vite build + dev proxy
├── tailwind.config.js                   ← Tailwind theme + animations
│
└── src/                                 ← All React source code
    ├── main.jsx                         ← React app bootstrap
    ├── App.jsx                          ← ⭐ Router + protected routes
    ├── index.css                        ← Global CSS variables & RGB theme
    │
    ├── context/
    │   └── AuthContext.jsx              ← ⭐ Global auth state
    │
    ├── components/
    │   └── common/
    │       ├── Layout.jsx               ← Sidebar + top navbar shell
    │       ├── LogoIcon.jsx             ← Custom SVG brand logo
    │       ├── GlobalBackground.jsx     ← Animated 3D background
    │       ├── LoadingSpinner.jsx       ← Full-screen loading
    │       └── ScoreCircle.jsx          ← Animated ATS score ring
    │
    └── pages/
        ├── HomePage.jsx                 ← Landing page with Marquee & Cards
        ├── LoginPage.jsx                ← Login form + Guest access
        ├── RegisterPage.jsx             ← Registration form
        ├── DashboardPage.jsx            ← Analytics dashboard
        ├── UploadPage.jsx               ← Resume upload interface
        ├── AnalysisPage.jsx             ← AI analysis results
        ├── ResumeBuilderPage.jsx        ← Resume builder (6 templates)
        ├── JobsPage.jsx                 ← AI job matching
        ├── InterviewPage.jsx            ← Interview hub
        ├── InterviewSessionPage.jsx     ← Active AI coaching
        ├── ProfilePage.jsx              ← Identity management
        ├── FeedbackPage.jsx             ← Platform review form
        └── SkillGapPage.jsx             ← Career roadmap tool
```

---

### 🔗 How Files Connect to Each Other

```
main.jsx
  └─ renders App.jsx
       ├─ wraps with AuthProvider (AuthContext.jsx)
       ├─ GlobalBackground.jsx
       ├─ BrowserRouter + Routes
       │    ├─ "/" → HomePage.jsx
       │    ├─ "/login" → LoginPage.jsx
       │    ├─ "/dashboard" → Layout.jsx → DashboardPage.jsx
       │    ├─ "/upload" → Layout.jsx → UploadPage.jsx
       │    ├─ "/analysis/:id" → Layout.jsx → AnalysisPage.jsx
       │    ├─ "/interview/:id" → Layout.jsx → InterviewSessionPage.jsx
       │    └─ ...
       └─ Toaster (global notifications)

api.js (services)
  ├─ authAPI → /api/auth/*
  ├─ resumeAPI → /api/resumes/*
  ├─ analysisAPI → /api/analysis/*
  ├─ jobsAPI → /api/jobs/*
  ├─ interviewAPI → /api/interviews/*
  ├─ dashboardAPI → /api/dashboard/*
  ├─ feedbackAPI → /api/feedback/*
  └─ screeningAPI → /api/screening/*

server.js (backend)
  ├─ connects via config/database.js → MongoDB
  ├─ applies middleware: helmet, cors, express.json, morgan
  ├─ mounts routes:
  │    ├─ auth.routes.js → auth.controller.js → User.model.js
  │    ├─ resume.routes.js → resume.controller.js → Resume.model.js → resumeParser.js
  │    ├─ analysis.routes.js → analysis.controller.js → Analysis.model.js → aiService.js
  │    ├─ interview.routes.js → interview.controller.js → Interview.model.js → aiService.js
  │    ├─ job.routes.js → job.controller.js → Job.model.js → aiService.js
  │    ├─ screening.routes.js → screening.controller.js → aiService.js
  │    ├─ dashboard.routes.js → dashboard.controller.js → (aggregates all models)
  │    ├─ feedback.routes.js → feedback.controller.js → Feedback.model.js
  │    └─ recruiter.routes.js → recruiter.controller.js → (User, Resume, Job models)
  └─ applies error handlers: notFound.js, errorHandler.js
```

---

## 📋 Ignored / Generated Files

| File/Folder | Why Ignored |
|-------------|-------------|
| `node_modules/` | Auto-installed packages; never modified manually |
| `package-lock.json` | Auto-generated lockfile; only summary needed |
| `frontend/dist/` | Production build output; re-generated each time |
| `backend/uploads/` | User-uploaded files; not source code |
| `.env` | Contains real secrets; NEVER committed to git |
| `.git/` | Git internals |

---

## 📋 Summary

The project has a clear two-root structure: `backend/` (Node.js/Express) and `frontend/` (React/Vite). Backend follows MVC pattern strictly. Frontend organizes code into pages, components, context, and services layers. Every API call flows through `services/api.js`. The central `server.js` and `App.jsx` are the entry points for their respective sides.

---

*Next: See [APPLICATION_FLOW.md](./APPLICATION_FLOW.md) for end-to-end flow diagrams.*
