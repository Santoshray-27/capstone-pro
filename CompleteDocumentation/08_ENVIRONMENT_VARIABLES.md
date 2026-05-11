# ENVIRONMENT VARIABLES — ResumeXpert AI

This document explains every environment variable used in the "Career OS" ecosystem — what each one does, why it is needed, and where it is used in the code.

---

## 🔒 Security First

> **NEVER commit your `.env` file to Git.**
> The `.gitignore` file already excludes it. Always use `.env.example` as the public template.

---

## 📋 Backend Environment Variables

### `.env.example` (Public Template)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/resumexpert-ai

# Authentication
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# AI API Keys
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key

# Job Search (RapidAPI - JSearch)
RAPIDAPI_KEY=your_rapidapi_key

# Deployment
FRONTEND_URL=http://localhost:5173
```

---

## 🔍 Key Variable Explanations

### `RAPIDAPI_KEY`
| Field | Value |
|-------|-------|
| **Required** | Yes (for real-time Job Matching) |
| **Type** | RapidAPI Key string |
| **Used in** | `utils/jobService.js` or `controllers/job.controller.js` |
| **Why needed** | Authenticates requests to the JSearch API via RapidAPI to fetch live job listings based on the user's AI-parsed profile. |
| **Example** | `RAPIDAPI_KEY=188475219bmsh83eb2dd0a68b741...` |

---

### `GEMINI_API_KEY`
| Field | Value |
|-------|-------|
| **Required** | YES (Primary Intelligence) |
| **Model** | `gemini-2.0-flash` |
| **Why needed** | Powers the core analysis engine, interview coach, and semantic profile generator. |

---

### `JWT_SECRET`
| Field | Value |
|-------|-------|
| **Required** | YES (Critical Security) |
| **Why needed** | Signs all authentication tokens. Must be a long, random string in production. |

---

## 🖥️ Frontend Environment Variables

### `VITE_API_URL`
| Field | Value |
|-------|-------|
| **Required** | Only in Production |
| **Default** | `http://localhost:5000/api` |
| **Why needed** | Points the React application to the correct live API endpoint. |

---

## 📋 Summary

ResumeXpert AI relies on a set of core intelligence keys (`GEMINI_API_KEY`, `RAPIDAPI_KEY`) and security keys (`JWT_SECRET`) to function. Ensuring these are correctly set in your environment is essential for the "Career OS" to provide real-time value.

---

*Project: ResumeXpert AI*
*Next: See [12_API_DOCUMENTATION.md](./12_API_DOCUMENTATION.md) for all REST API endpoints.*
