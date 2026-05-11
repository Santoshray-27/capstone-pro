# COMPONENTS AND MODULES — ResumeXpert AI

This document explains every frontend component and backend module/service in the ResumeXpert AI ecosystem.

---

## 🖥️ Frontend Components

### `src/components/common/Layout.jsx`

**Purpose:** The premium "Career OS" shell that wraps every authenticated page. Provides the high-density sidebar navigation.

**What it renders:**
- **Sidebar** — Left navigation panel with links to core modules: Dashboard, Upload, Analysis, Builder, Jobs, Interview, Skill Gap, and Feedback.
- **Top Navbar** — Shows breadcrumbs, search integration, notifications, and user avatar.
- **`{children}`** — The actual page content rendered in the main viewport.

**Connects to:** `useAuth()` hook, `LogoIcon.jsx`.

---

### `src/components/common/LogoIcon.jsx`

**Purpose:** Custom SVG brand symbol combining a document, magnifying glass, user profile, and AI circuit nodes.

**Features:**
- Adapts to primary color theme via `currentColor`.
- Scalable for usage in Navbars, Sidebars, and Footers.
- Hover-reactive animations.

---

### `src/components/common/GlobalBackground.jsx`

**Purpose:** Renders an animated 3D background behind all pages using Three.js.

**How it works:**
- Creates a Three.js canvas element
- Animates subtle floating particles or geometry
- Positioned as a fixed, full-screen background layer

**Connects to:** `App.jsx` (rendered once globally)

---

### `src/components/common/LoadingSpinner.jsx`

**Purpose:** Full-screen or inline loading animation shown while data is being fetched.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `fullscreen` | Boolean | If true, centers spinner on full screen; otherwise inline |

**Used in:** `App.jsx` (for auth check loading), all pages that fetch data

---

### `src/components/common/ScoreCircle.jsx`

**Purpose:** Renders an animated circular gauge showing a numeric score (used for ATS score display).

**How it works:**
- SVG-based circular path
- Animated stroke-dashoffset transition to fill the circle proportionally to the score
- Color changes based on score range (red → yellow → green)

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `score` | Number | Score value (0-100) |
| `size` | Number | Diameter in pixels |
| `label` | String | Text shown below the circle |

**Used in:** `AnalysisPage.jsx`, `DashboardPage.jsx`

---

### `src/components/common/Antigravity.jsx`

**Purpose:** A decorative/branding component, likely the "Antigravity" powered badge or animated element.

**Connects to:** Used in branding sections of pages

---

## 📄 Frontend Pages

### `src/pages/HomePage.jsx`

**Purpose:** Public-facing landing page showcasing the "ResumeXpert AI" brand identity.

**Key sections:**
- **Hero Section:** High-conversion headline with primary CTA and secondary guest demo.
- **Infinite Marquee:** Looping strip of core platform features with interactive pause states.
- **Stacked Career OS Cards:** Vertical-scrolling sticky card deck showcasing deep feature modularity.
- **Interactive Tech Stack:** Grid of integrated technologies powering the platform.
- **High-Trust Testimonials:** Modern review cards with glassmorphism effects.

**Connects to:** `react-router-dom` Navigate, `useAuth()`, `LogoIcon.jsx`.

---

### `src/pages/LoginPage.jsx`

**Purpose:** Secure authentication portal with a focus on quick access.

**Features:**
- Split-screen design with premium branding on one side.
- Email + password form with validation.
- One-click Guest Demo access (Job Seeker role).
- Automatic JWT storage and redirection.

---

### `src/pages/RegisterPage.jsx`

**Purpose:** New user onboarding experience.

**Features:**
- Modern multi-field form with real-time validation.
- Success-oriented messaging and brand-aligned visuals.
- Instant login upon successful account creation.

---

### `src/pages/DashboardPage.jsx`

**Purpose:** Central mission control for job seekers.

**Key sections:**
- **High-Density Stats:** Total resumes, analyses, interviews, and real-time avg ATS score.
- **Recharts Integration:** ATS score trends (LineChart) and skill radar (RadarChart).
- **Activity Feed:** Quick access to recent analyses and interview sessions.

---

### `src/pages/AnalysisPage.jsx`

**Purpose:** Deep-dive intelligence reports for uploaded resumes.

**Key features:**
- **Dynamic Scoring:** Animated circular gauge with range-based color coding.
- **Gap Detection:** Interactive chips for missing skills and industry keywords.
- **Actionable Insights:** Prioritized strengths, weaknesses, and improvement roadmaps.

---

### `src/pages/ResumeBuilderPage.jsx`

**Purpose:** Pixel-perfect document generation tool.

**Features:**
- **6 Premium Templates:** Modern, Professional, Minimal, Creative, ATS-Classic, and Executive.
- **Markdown Preview:** Live, pixel-perfect rendering of the resume document.
- **Vector Export:** High-quality PDF generation via `html2pdf.js`.

---

### `src/pages/InterviewPage.jsx`

**Purpose:** Configuration hub for the AI Interview Coach.

**Features:**
- Session customization: Experience level, role target, and interview type.
- Historical tracking: View past session performance and score growth.

---

### `src/pages/InterviewSessionPage.jsx`

**Purpose:** The live, high-pressure interview simulation environment.

**Features:**
- **Contextual Questioning:** AI generates questions based on the user's specific resume and role.
- **Instant Evaluation:** Scoring and model-answer feedback provided after every response.
- **Performance Summary:** Holistic score and feedback given at session completion.

---

### `src/pages/SkillGapPage.jsx`

**Purpose:** Forward-looking career planning tool.

**Features:**
- **Market Benchmarking:** Compares resume against real-world target role requirements.
- **Growth Roadmap:** AI-suggested learning paths and certification tracks.

---

### `src/pages/ProfilePage.jsx`

**Purpose:** Central identity and settings management.

**Features:**
- Profile data management: Social links, target roles, and bio.
- Security controls: Password rotation and account management.

---

### `src/pages/FeedbackPage.jsx`

**Purpose:** Direct line of communication for platform improvement.

**Features:**
- Categorized feedback (Bug, Feature, Review).
- Star-rating system with optional anonymity.

---

## ⚙️ Backend Modules (Services/Utils)

### `backend/utils/aiService.js`

**Purpose:** Central AI integration layer. Provides 6 AI-powered functions used by controllers.

**Exported functions:**

| Function | What It Does |
|----------|-------------|
| `analyzeResume(resumeText, jobTitle, jobDescription)` | Sends resume to AI, returns ATS score + detailed feedback |
| `getJobRecommendations(resumeData, count)` | Generates N job recommendations based on resume profile |
| `generateInterviewQuestions(jobTitle, skills, level, count, type)` | Creates N tailored interview questions |
| `evaluateInterviewAnswer(question, answer, jobTitle, expectedAnswer, format)` | Scores and provides feedback on one answer |
| `screenResume(resumeText, jobTitle, jobDescription, requiredSkills)` | Screens a resume against a job, returns verdict |
| `analyzeSkillGap(resumeText, skills, targetRole, experienceLevel)` | Analyzes skill gaps for a target role |

**Internal helpers:**
- `callGemini(prompt)` — Calls Google Gemini REST API
- `callOpenAI(prompt)` — Calls OpenAI REST API
- `callGroq(prompt)` — Calls Groq REST API
- `callAI(prompt)` — Orchestrates fallback chain: Gemini → OpenAI → Groq
- `parseAIJson(text)` — Safely extracts JSON from AI text response (handles markdown code blocks)

---

### `backend/utils/resumeParser.js`

**Purpose:** Extracts structured information from uploaded PDF and DOCX files.

**Exported functions:**

| Function | What It Does |
|----------|-------------|
| `parseResume(filePath)` | Main function: extracts all data from a file |
| `extractFromPDF(filePath)` | Extracts raw text from PDF using `pdf-parse` |
| `extractFromDOCX(filePath)` | Extracts raw text from DOCX using `mammoth` |
| `extractSkills(text)` | Matches skill keywords from a large dictionary |
| `extractContactInfo(text)` | Extracts email, phone, name, LinkedIn, GitHub |

**Internal functions:**
- `extractExperience(text)` — Parses work experience section
- `extractEducation(text)` — Parses education section
- `extractSummary(text)` — Extracts professional summary paragraph
- `cleanName(name)` — Validates and cleans extracted name

**Skill dictionary categories:** programming, frontend, backend, database, cloud, devops, mobile, aiml, soft skills

---

### `backend/utils/generateToken.js`

**Purpose:** Creates JWT tokens for authentication.

**Exported functions:**

| Function | Parameters | Returns |
|----------|-----------|---------|
| `generateToken(userId, role)` | MongoDB userId string, role string | Signed JWT (7-day expiry) |
| `generateRefreshToken(userId)` | MongoDB userId string | Signed JWT (30-day expiry) |

---

### `backend/config/database.js`

**Purpose:** Handles MongoDB connection with event monitoring and graceful shutdown.

**Behavior:**
- Connects on startup via `MONGODB_URI`
- 5-second server selection timeout
- Logs connected host
- Handles `error`, `disconnected`, `reconnected` events
- In production: exits process on connection failure
- In development: continues without DB (demo mode)
- Handles `SIGINT` (Ctrl+C) for graceful disconnect

---

## 🔗 How Frontend Modules Communicate

```
AuthContext (Global)
  ├─ Provides: user, token, isAuthenticated, login, logout, register, guestLogin
  └─ Consumed by: App.jsx (ProtectedRoute), Layout.jsx, all pages via useAuth()

api.js (Services)
  ├─ authAPI → used by LoginPage, RegisterPage, ProfilePage, AuthContext
  ├─ resumeAPI → used by UploadPage, AnalysisPage, ResumeBuilderPage
  ├─ analysisAPI → used by AnalysisPage, DashboardPage
  ├─ jobsAPI → used by JobsPage
  ├─ interviewAPI → used by InterviewPage, InterviewSessionPage
  ├─ dashboardAPI → used by DashboardPage
  ├─ feedbackAPI → used by FeedbackPage
  ├─ recruiterAPI → used by RecruiterPage
  └─ screeningAPI → used by ScreeningPage, SkillGapPage
```

---

## 📋 Summary

The frontend is organized into:
1. **5 common components** in `components/common/` — reusable across all pages
2. **15 page components** in `pages/` — each corresponds to a route
3. **1 context** (`AuthContext`) — global auth state
4. **1 service file** (`api.js`) — all API calls centralized

The backend is organized into:
1. **9 controllers** — one per feature domain
2. **9 route files** — map URLs to controllers
3. **6 models** — MongoDB schemas
4. **3 utilities** — AI, parser, token
5. **4 middleware** — auth, upload, error handling, 404
6. **1 config** — database connection

---

*Next: See [FILE_BY_FILE_EXPLANATION.md](./FILE_BY_FILE_EXPLANATION.md) for per-file deep dives.*
