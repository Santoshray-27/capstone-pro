# 🚀 ResumeXpert AI

**ResumeXpert AI** is a premium Career OS built on the MERN stack. For better scalability and independent deployment, this project is divided into two specialized repositories:

1.  **[Backend API](https://github.com/your-username/resumexpert-ai-api)** — The AI intelligence engine (Node.js/Express).
2.  **[Frontend UI](https://github.com/your-username/resumexpert-ai-ui)** — The premium user interface (React/Vite).

---

## ✨ Career OS Features

| Feature | Description |
|---------|------------|
| 🔐 **Authentication** | Secure JWT-based access with instant Guest Demo modes |
| 📄 **Resume Upload** | Upload PDF/DOCX, AI-powered semantic parsing of skills & experience |
| 🧠 **Deep AI ATS Analysis** | Simulation of 50+ enterprise ATS platforms with actionable suggestions |
| 🏗️ **Resume Builder** | 6 premium templates with live preview and PDF export |
| 💼 **Job Matcher** | Semantic matching engine that finds roles based on your skill footprint |
| 🎤 **AI Coaching** | Contextual mock interviews with real-time evaluation & feedback |
| 📊 **Career Analytics** | High-density dashboard tracking score trends and growth |
| 🌊 **Modern Interface** | Infinite Marquee and Stacked Card animations for a premium feel |

---

## 🗂️ Unified Folder Structure (Local Dev)

```
Resume/
├── backend/                  # Express REST API
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── utils/               # AI Service & Parsers
│   └── server.js            # Entry point
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Career OS modules
│   │   ├── services/        # API integration
│   │   └── App.jsx          # Router
│   └── index.html
│
└── CompleteDocumentation/    # Comprehensive technical docs
```

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone <your-repo>
cd Resume

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Environment Setup
Create a `.env` in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
OPENAI_API_KEY=your_key
GROQ_API_KEY=your_key
```

### 3. Run Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000/api/health

---

## 🤖 AI Fallback Engine

ResumeXpert AI ensures 100% uptime through a 3-tier fallback chain:
1. **Google Gemini 2.0 Flash** (Primary)
2. **OpenAI GPT-3.5** (Secondary)
3. **Groq LLaMA 3.1** (Tertiary)

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Three.js |
| **Backend** | Node.js, Express.js (MVC) |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JWT, bcryptjs |
| **AI** | Gemini 2.0, OpenAI, Groq |

---

## 📄 License

MIT License — Built for the next generation of job seekers.
