# TECH STACK — ResumeXpert AI

This document explains every technology, library, and tool used in the project — **what it is**, **why it was chosen**, and **where it is used**.

---

## 🖥️ Frontend Technologies

### React 18
| Detail | Info |
|--------|------|
| **What it is** | A JavaScript library for building user interfaces using reusable components |
| **Why used** | Industry standard for SPAs; component model makes pages like Dashboard, Analysis, Interview easy to build and maintain |
| **Where used** | All files in `frontend/src/` — pages, components, context |
| **Version** | `^18.2.0` |

### React DOM
- Companion to React for rendering components to the browser's DOM.
- Used in `main.jsx` via `ReactDOM.createRoot().render()`.

### Vite 5
| Detail | Info |
|--------|------|
| **What it is** | An ultra-fast build tool and dev server for modern JavaScript projects |
| **Why used** | Replaces Create React App; much faster HMR (Hot Module Replacement), native ESM support |
| **Where used** | `frontend/vite.config.js`; runs `npm run dev` and `npm run build` |
| **Version** | `^5.0.11` |

**Key Vite features used:**
- **Dev server proxy**: Forwards `/api` requests to `http://localhost:5000` (avoids CORS in dev).
- **Build**: Outputs to `frontend/dist/` which the Express backend serves in production.

### Tailwind CSS 3
| Detail | Info |
|--------|------|
| **What it is** | A utility-first CSS framework where you style elements using class names |
| **Why used** | Speeds up UI development; consistent spacing, colors, and responsive design |
| **Where used** | Every JSX file — all class names like `flex`, `gap-4`, `text-xl`, etc. |
| **Config** | `frontend/tailwind.config.js` |

**Custom configuration includes:**
- **RGB Color Palette:** Modern system with variables like `rgb(110, 86, 207)` for Primary and `rgb(42, 42, 74)` for Foreground.
- **Font Stack:** Professional typography using **Inter** (Sans) and **JetBrains Mono** (Mono).
- **Custom Animations:** `marquee` (for infinite scrolling), `fade-in`, `slide-up`, `pulse-slow`.
- **Advanced Shadow System:** Custom tiered shadows (`shadow-sm` to `shadow-2xl`) using HSL color mapping for depth.

### React Router DOM v6
| Detail | Info |
|--------|------|
| **What it is** | Client-side routing library for React SPAs |
| **Why used** | Enables multi-page navigation without full page reloads |
| **Where used** | `App.jsx` — defines all routes with `<BrowserRouter>`, `<Routes>`, `<Route>` |
| **Key components** | `Navigate` (redirect), `useNavigate` hook |

### Axios
| Detail | Info |
|--------|------|
| **What it is** | HTTP client library for making API calls from the browser |
| **Why used** | Cleaner API than native `fetch`; supports interceptors for automatic token attachment and 401 handling |
| **Where used** | `frontend/src/services/api.js` — all backend API calls |
| **Version** | `^1.6.5` |

**Key Axios features used:**
- **Request interceptor**: Automatically attaches `Authorization: Bearer <token>` from `localStorage`.
- **Response interceptor**: Redirects to `/login` on 401 responses.

### React Hot Toast
| Detail | Info |
|--------|------|
| **What it is** | A lightweight toast notification library for React |
| **Why used** | Provides success/error/loading notifications without complex state management |
| **Where used** | `App.jsx` (global `<Toaster>`); individual pages call `toast.success()`, `toast.error()` |
| **Version** | `^2.4.1` |

### Recharts
| Detail | Info |
|--------|------|
| **What it is** | A charting library built on top of D3.js for React |
| **Why used** | Renders score trend lines, radar charts, and bar charts on the dashboard |
| **Where used** | `DashboardPage.jsx`, `AnalysisPage.jsx` |
| **Version** | `^2.10.3` |

**Charts used:**
- `LineChart` — ATS score over time
- `RadarChart` — Skills breakdown
- `BarChart` — Category scores

### Lucide React
| Detail | Info |
|--------|------|
| **What it is** | Icon library providing consistent SVG icons as React components |
| **Why used** | Clean, consistent icon set; tree-shakeable (only imports icons you use) |
| **Where used** | Throughout all pages and components for icons like `Upload`, `Brain`, `Target`, `CheckCircle` |
| **Version** | `^0.309.0` |

### Three.js + @react-three/fiber
| Detail | Info |
|--------|------|
| **What it is** | 3D graphics library (Three.js) with a React renderer (R3F) |
| **Why used** | Used for the animated 3D background on the Home page (`GlobalBackground.jsx`) |
| **Where used** | `GlobalBackground.jsx`, potentially `Antigravity.jsx` |
| **Versions** | `three: ^0.184.0`, `@react-three/fiber: ^8.18.0` |

### html2pdf.js
| Detail | Info |
|--------|------|
| **What it is** | Client-side PDF generation from HTML content |
| **Why used** | Allows users to export their built resume as a downloadable PDF |
| **Where used** | `ResumeBuilderPage.jsx` |
| **Version** | `^0.10.1` |

---

## 🖧 Backend Technologies

### Node.js
| Detail | Info |
|--------|------|
| **What it is** | JavaScript runtime that allows running JS on the server (outside a browser) |
| **Why used** | Same language as frontend; large ecosystem; great for I/O-intensive apps like API servers |
| **Where used** | Entire `backend/` directory |

### Express.js 4
| Detail | Info |
|--------|------|
| **What it is** | Minimal and flexible Node.js web framework |
| **Why used** | Industry standard for building REST APIs; easy middleware integration |
| **Where used** | `backend/server.js`, all route files |
| **Version** | `^4.18.2` |

**Pattern used:** MVC (Model-View-Controller) — Routes → Controllers → Models

### MongoDB
| Detail | Info |
|--------|------|
| **What it is** | A NoSQL document database that stores data as JSON-like BSON documents |
| **Why used** | Flexible schema suits AI-generated data that can vary in structure; great for storing parsed resume data |
| **Where used** | Cloud (MongoDB Atlas recommended) or local `mongodb://localhost:27017/smart-resume-analyzer` |

### Mongoose 8
| Detail | Info |
|--------|------|
| **What it is** | Object Data Modeling (ODM) library for MongoDB and Node.js |
| **Why used** | Provides schema validation, middleware (pre-save hooks), and a clean query API |
| **Where used** | All model files: `User.model.js`, `Resume.model.js`, `Analysis.model.js`, `Interview.model.js`, `Job.model.js`, `Feedback.model.js` |
| **Version** | `^8.0.3` |

### JSON Web Tokens (jsonwebtoken)
| Detail | Info |
|--------|------|
| **What it is** | A standard for creating signed tokens to represent claims between parties |
| **Why used** | Stateless authentication — no session storage needed; token carries user ID and role |
| **Where used** | `utils/generateToken.js` (create), `middleware/auth.middleware.js` (verify) |
| **Version** | `^9.0.2` |

### bcryptjs
| Detail | Info |
|--------|------|
| **What it is** | Password hashing library using the bcrypt algorithm |
| **Why used** | Passwords must NEVER be stored as plain text; bcrypt adds salting + slow hashing to resist brute force |
| **Where used** | `User.model.js` (pre-save hook hashes password), `auth.controller.js` (compare) |
| **Version** | `^2.4.3` |

### Multer
| Detail | Info |
|--------|------|
| **What it is** | Node.js middleware for handling `multipart/form-data` (file uploads) |
| **Why used** | Handles resume file uploads with configurable file size limits, type filtering, and disk storage |
| **Where used** | `middleware/upload.middleware.js` |
| **Version** | `^1.4.5-lts.1` |

### pdf-parse
| Detail | Info |
|--------|------|
| **What it is** | Library to extract raw text from PDF files |
| **Why used** | Resume PDFs need to be converted to plain text before AI analysis |
| **Where used** | `utils/resumeParser.js` → `extractFromPDF()` |
| **Version** | `^1.1.1` |

### mammoth
| Detail | Info |
|--------|------|
| **What it is** | Library to extract plain text from Microsoft Word (.docx) files |
| **Why used** | Many users upload DOCX resumes; mammoth converts them to readable text |
| **Where used** | `utils/resumeParser.js` → `extractFromDOCX()` |
| **Version** | `^1.6.0` |

### node-fetch
| Detail | Info |
|--------|------|
| **What it is** | A `fetch` API polyfill for Node.js (CommonJS compatible version) |
| **Why used** | Used to make HTTP calls to Gemini, OpenAI, and Groq APIs from the backend |
| **Where used** | `utils/aiService.js` — all three AI API call functions |
| **Version** | `^2.7.0` (v2 for CJS compatibility) |
| **Note** | v2 is used specifically because the project uses CommonJS (`require`), not ESM |

### Helmet
| Detail | Info |
|--------|------|
| **What it is** | Express middleware that sets HTTP security headers |
| **Why used** | Protects against common attacks (XSS, clickjacking, MIME sniffing) by setting headers like `Content-Security-Policy` |
| **Where used** | `server.js` — applied globally |
| **Version** | `^7.1.0` |

### CORS
| Detail | Info |
|--------|------|
| **What it is** | Cross-Origin Resource Sharing middleware for Express |
| **Why used** | Browser blocks requests from one origin (5173) to another (5000); CORS config explicitly allows the frontend |
| **Where used** | `server.js` |
| **Version** | `^2.8.5` |

### Morgan
| Detail | Info |
|--------|------|
| **What it is** | HTTP request logger middleware for Node.js |
| **Why used** | Logs incoming requests (method, URL, status, time) in development for debugging |
| **Where used** | `server.js` — only enabled in `NODE_ENV=development` |
| **Version** | `^1.10.0` |

### dotenv
| Detail | Info |
|--------|------|
| **What it is** | Loads environment variables from a `.env` file into `process.env` |
| **Why used** | Keeps secrets (API keys, DB URIs) out of source code |
| **Where used** | `server.js` → `require('dotenv').config()` |
| **Version** | `^16.3.1` |

---

## 🤖 AI Services Used

| Service | Model | Priority | API Key Variable |
|---------|-------|----------|-----------------|
| **Google Gemini** | `gemini-2.0-flash` | 1st (primary) | `GEMINI_API_KEY` |
| **OpenAI** | `gpt-3.5-turbo` | 2nd (fallback) | `OPENAI_API_KEY` |
| **Groq** | `llama-3.1-8b-instant` | 3rd (fallback) | `GROQ_API_KEY` |

All three are called via REST API in `utils/aiService.js`.

---

## 🛠️ Dev & Build Tools

| Tool | Purpose |
|------|---------|
| **Nodemon** | Restarts backend server on file changes during development |
| **ESLint** | JavaScript linting — catches bugs and enforces code style |
| **eslint-plugin-react** | React-specific lint rules |
| **eslint-plugin-react-hooks** | Enforces Rules of Hooks |
| **PostCSS** | CSS processor — runs Tailwind CSS and Autoprefixer |
| **Autoprefixer** | Adds vendor prefixes to CSS for browser compatibility |
| **@vitejs/plugin-react** | Enables React fast refresh in Vite |
| **@types/react** | TypeScript type definitions for React (helps IDE autocomplete) |
| **PM2** | Process manager for production Node.js apps (`ecosystem.config.cjs`) |

---

## 📋 Summary

ResumeXpert AI uses a clean, well-known stack (MERN) enhanced with a robust AI layer. Vite ensures a fast frontend dev experience, Tailwind enables rapid UI styling with a custom RGB theme, and the three-provider AI fallback (Gemini → OpenAI → Groq) ensures high availability. The "Career OS" design is realized through modern CSS techniques like sticky cards and infinite marquee animations.

---

*Next: See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the complete folder and file tree.*
