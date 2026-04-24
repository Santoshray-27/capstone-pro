# 🧠 Smart AI Resume Analyzer

A **production-ready MERN stack** application that uses AI (Gemini/OpenAI) to analyze resumes, provide ATS scores, recommend jobs, and prepare candidates for interviews.

---

## ✨ Features

| Feature | Description |
|---------|------------|
| 🔐 **Authentication** | JWT-based login/register with role support (Job Seeker / Recruiter) |
| 👤 **Guest Login** | **New!** Instant access as Job Seeker or Recruiter without registration |
| 📤 **Resume Upload** | Upload PDF/DOCX, auto-parse name, email, skills, experience |
| 🧠 **AI ATS Analysis** | Score 0-100, strengths, weaknesses, keywords, suggestions |
| 📝 **Resume Builder** | 4 templates: Modern, Professional, Minimal, Creative + PDF export |
| 💼 **Job Recommendations** | AI-matched jobs based on resume skills and experience |
| 🎤 **Interview Prep** | AI-generated questions, answer evaluation with score + feedback |
| 📊 **Dashboard Analytics** | Recharts graphs: score trends, radar chart, skills bar |
| 👥 **Recruiter Dashboard** | Post jobs, search candidates, track applications |
| 💬 **Feedback System** | Submit platform/feature feedback with ratings |

---

## 🗂️ Folder Structure

```
smart-resume-analyzer/
├── backend/
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js       # Login/register/guest-login
│   │   ├── resume.controller.js     # Upload/parse/manage
│   │   ├── analysis.controller.js   # AI ATS analysis
│   │   ├── job.controller.js        # Job listings + recommendations
│   │   ├── interview.controller.js  # Interview sessions
│   │   ├── feedback.controller.js   # Feedback CRUD
│   │   ├── dashboard.controller.js  # Analytics
│   │   └── recruiter.controller.js  # Recruiter features
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT protect + authorize
│   │   ├── upload.middleware.js     # Multer file upload
│   │   ├── errorHandler.js          # Global error handler
│   │   └── notFound.js              # 404 handler
│   ├── models/
│   │   ├── User.model.js            # User schema + bcrypt
│   │   ├── Resume.model.js          # Resume metadata + parsed data
│   │   ├── Analysis.model.js        # ATS scores + AI feedback
│   │   ├── Job.model.js             # Job listings
│   │   ├── Interview.model.js       # Interview sessions + Q&A
│   │   └── Feedback.model.js        # User feedback
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── resume.routes.js
│   │   ├── analysis.routes.js
│   │   ├── job.routes.js
│   │   ├── interview.routes.js
│   │   ├── feedback.routes.js
│   │   ├── dashboard.routes.js
│   │   └── recruiter.routes.js
│   ├── utils/
│   │   ├── aiService.js             # Gemini + OpenAI + mock fallback
│   │   ├── resumeParser.js          # PDF/DOCX text extraction
│   │   └── generateToken.js         # JWT token generation
│   ├── uploads/                     # Uploaded resume files
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Layout.jsx       # Sidebar + navbar shell
    │   │       ├── LoadingSpinner.jsx
    │   │       └── ScoreCircle.jsx  # Animated score ring
    │   ├── context/
    │   │   └── AuthContext.jsx      # Global auth state
    │   ├── pages/
    │   │   ├── HomePage.jsx         # Landing page
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx    # Analytics dashboard
    │   │   ├── UploadPage.jsx       # Drag & drop upload
    │   │   ├── AnalysisPage.jsx     # AI feedback view
    │   │   ├── ResumeBuilderPage.jsx # 4-template builder
    │   │   ├── JobsPage.jsx         # Job recommendations
    │   │   ├── InterviewPage.jsx    # Create sessions
    │   │   ├── InterviewSessionPage.jsx # Active interview
    │   │   ├── ProfilePage.jsx
    │   │   ├── FeedbackPage.jsx
    │   │   └── RecruiterPage.jsx
    │   ├── services/
    │   │   └── api.js               # Axios API layer
    │   ├── App.jsx                  # Router + protected routes
    │   └── main.jsx
    └── package.json
```

---

## 🚀 API Reference

### Auth Routes
```
POST   /api/auth/register       → Register new user
POST   /api/auth/login          → Login, returns JWT
POST   /api/auth/guest-login    → Instant login (no credentials)
GET    /api/auth/me             → Get current user (auth required)
PUT    /api/auth/profile        → Update profile
PUT    /api/auth/change-password → Change password
```

### Resume Routes
```
POST   /api/resumes/upload      → Upload PDF/DOCX
GET    /api/resumes             → List my resumes
GET    /api/resumes/:id         → Get single resume
PUT    /api/resumes/:id         → Update resume title
DELETE /api/resumes/:id         → Delete resume
```

### Analysis Routes
```
POST   /api/analysis/analyze/:resumeId  → Run AI analysis
GET    /api/analysis/my/all             → All my analyses
GET    /api/analysis/resume/:resumeId   → Analyses for resume
GET    /api/analysis/:id                → Single analysis
```

### Job Routes
```
GET    /api/jobs/recommendations  → AI-personalized job list
GET    /api/jobs                  → Browse all jobs
GET    /api/jobs/:id              → Single job
POST   /api/jobs                  → Post a job (recruiter)
PUT    /api/jobs/:id              → Update job (recruiter)
DELETE /api/jobs/:id              → Remove job (recruiter)
```

### Interview Routes
```
POST   /api/interviews/create     → Create session (AI generates questions)
GET    /api/interviews            → List my sessions
GET    /api/interviews/:id        → Single session
POST   /api/interviews/:id/answer → Submit + evaluate answer
POST   /api/interviews/:id/complete → Finalize session
```

### Dashboard & Other
```
GET    /api/dashboard/stats       → User analytics
GET    /api/dashboard/admin       → Admin stats
POST   /api/feedback              → Submit feedback
GET    /api/recruiter/dashboard   → Recruiter overview
GET    /api/recruiter/candidates  → Search candidates
```

---

## 🔧 Local Development Setup

### 1. Clone & Install
```bash
git clone <your-repo>
cd smart-resume-analyzer

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Environment
```bash
# backend/.env
PORT=5000
MONGODB_URI=mongodb+srv://...    # Your MongoDB connection string
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_key    # Get from: aistudio.google.com
OPENAI_API_KEY=your_openai_key    # Optional fallback
FRONTEND_URL=http://localhost:5173
```

### 3. Run Development Mode
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 🌐 Production Deployment

### Backend → Railway or Render

1. **Push to GitHub**
2. **Connect to Railway**: railway.app → New Project → Deploy from GitHub
3. **Set environment variables** in Railway dashboard.

### Frontend → Vercel

1. **Build frontend**: `cd frontend && npm run build`
2. **Deploy to Vercel**.
3. **Set environment variable** `VITE_API_URL` to your backend URL.

---

## 🤖 AI Configuration

The app uses a priority chain:
1. **Gemini 1.5 Flash** (free, fast) → preferred
2. **OpenAI GPT-3.5** → fallback
3. **Mock data** → fallback if neither key set

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Node.js, Express.js, MVC Architecture |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| AI Integration | Google Gemini 1.5, OpenAI GPT-3.5 |

---

## 📄 License

MIT License — Built for learning and production use.
