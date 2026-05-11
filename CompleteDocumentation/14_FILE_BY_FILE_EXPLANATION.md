# FILE BY FILE EXPLANATION — Smart AI Resume Analyzer

This document explains the purpose, imports, functions, and connections of every source code file.

---

## 📁 Backend Files

### `backend/server.js`
**Purpose:** Main entry point for the Express application. Bootstraps the entire backend.

**Important imports:**
- `express` — Creates the app instance
- `cors`, `helmet`, `morgan` — Security and logging middleware
- `dotenv` — Loads `.env` file
- All route files from `./routes/`
- `./config/database` — MongoDB connection
- `./middleware/errorHandler`, `./middleware/notFound`

**Key logic:**
1. Calls `connectDB()` to connect to MongoDB
2. Applies global middleware (helmet, cors, json parser, morgan)
3. Serves `/uploads` directory as static files
4. Registers all API routes under `/api/*`
5. In production: serves React frontend's `dist/` folder
6. Registers 404 and error handler middleware at the end
7. Starts listening on `PORT`
8. Handles `unhandledRejection` and `uncaughtException` to prevent silent failures

**Connects to:** All route files, `config/database.js`, both middleware files

---

### `backend/config/database.js`
**Purpose:** MongoDB connection logic with monitoring and graceful shutdown.

**Imports:** `mongoose`

**Exported function:** `connectDB()` — async function that connects to MongoDB

**Key logic:**
- Uses `MONGODB_URI` env variable (fallback: `localhost:27017`)
- Sets `serverSelectionTimeoutMS: 5000` to fail fast instead of hanging
- Listens for `error`, `disconnected`, `reconnected` events
- In dev mode: doesn't exit on failure (demo mode)
- Listens for `SIGINT` (Ctrl+C) for clean disconnect

**Connects to:** Called by `server.js` on startup

---

### `backend/utils/aiService.js`
**Purpose:** Central AI service module. All AI-powered features call functions from this file.

**Imports:** `node-fetch` (required per-call for CJS compatibility)

**Exported functions:** `analyzeResume`, `getJobRecommendations`, `generateInterviewQuestions`, `evaluateInterviewAnswer`, `screenResume`, `analyzeSkillGap`

**Internal functions:**
- `callGemini(prompt)` — Calls Gemini 2.0 Flash via REST API
- `callOpenAI(prompt)` — Calls GPT-3.5-turbo via OpenAI API
- `callGroq(prompt)` — Calls LLaMA 3.1-8b via Groq API
- `callAI(prompt)` — Orchestrates fallback chain; returns `{text, model}` or `null`
- `parseAIJson(text)` — Robust JSON extraction (handles markdown, bare JSON, partial JSON)

**Key design decisions:**
- Each AI function builds a detailed, specific prompt
- All prompts instruct AI to return ONLY valid JSON
- `parseAIJson` uses 4 fallback strategies to handle imperfect AI output
- If all AI providers fail, controllers throw user-friendly errors

**Connects to:** All controllers that need AI functionality (analysis, interview, job, screening)

---

### `backend/utils/resumeParser.js`
**Purpose:** Extracts structured data from PDF/DOCX resume files.

**Imports:** `fs`, `path`, `pdf-parse` (lazy), `mammoth` (lazy)

**Exported functions:** `parseResume`, `extractFromPDF`, `extractFromDOCX`, `extractSkills`, `extractContactInfo`

**Key design decisions:**
- Libraries are `require()`d inside functions (lazy loading) to avoid startup errors if not installed
- Uses regex patterns for email, phone, LinkedIn, GitHub extraction
- Contains a comprehensive `SKILL_KEYWORDS` dictionary with 8 categories and 150+ skills
- Section detection uses regex to find headers like "EXPERIENCE", "EDUCATION", "SKILLS"
- Returns both `rawText` (for AI) and structured `parsedData` (for display)

**Connects to:** `resume.controller.js` (called after Multer saves the file)

---

### `backend/utils/generateToken.js`
**Purpose:** JWT token creation utility.

**Imports:** `jsonwebtoken`

**Exported functions:**
- `generateToken(userId, role)` — Creates 7-day JWT with `id`, `role`, and `isDemo` flag
- `generateRefreshToken(userId)` — Creates 30-day refresh JWT

**Token metadata:** issuer: `smart-resume-analyzer`, audience: `smart-resume-analyzer-api`

**Connects to:** `auth.controller.js` (login, register, guest-login, change-password)

---

### `backend/middleware/auth.middleware.js`
**Purpose:** JWT verification and role-based access control middleware.

**Imports:** `jsonwebtoken`, `User.model.js`

**Exported functions:**
- `protect` — Verifies JWT; attaches `req.user`; returns 401 if invalid
- `authorize(...roles)` — Factory: returns middleware that checks if `req.user.role` is in allowed roles
- `optionalAuth` — Like `protect` but doesn't fail if no token (for public routes that show extras when logged in)

**Special behavior:** In development mode, if DB lookup fails, creates a mock user for demo tokens

**Connects to:** All route files (applied per-route or per-router)

---

### `backend/middleware/errorHandler.js`
**Purpose:** Global error handler. Catches all errors thrown in controllers and returns consistent JSON.

**Imports:** None

**Handles:**
- `ValidationError` (Mongoose) → 400 with field-level errors
- `CastError` (invalid ObjectId) → 400
- Duplicate key (error code 11000) → 400 with field name
- `JsonWebTokenError` → 401
- `TokenExpiredError` → 401
- Multer `LIMIT_FILE_SIZE` → 400
- Multer `LIMIT_UNEXPECTED_FILE` → 400
- In development: includes `stack` trace in response
- In production: only logs 5xx errors

**Connects to:** Called at the end of `server.js` middleware chain; receives errors via `next(error)` from controllers

---

### `backend/middleware/upload.middleware.js`
**Purpose:** Configures Multer for file uploads.

**Imports:** `multer`, `path`, `fs`

**Key configuration:**
- **Storage:** `diskStorage` with per-user subdirectory (`uploads/{userId}/`)
- **Filename:** `resume-{timestamp}-{random}{ext}`
- **Filter:** Only allows `application/pdf`, `application/msword`, `.docx` MIME types AND matching extensions
- **Limits:** 10MB max (from `MAX_FILE_SIZE` env), 1 file at a time

**Exported:** `handleResumeUpload` (wrapped Multer with custom error handling), `upload`

**Connects to:** `resume.routes.js` — applied on POST `/upload`

---

### `backend/middleware/notFound.js`
**Purpose:** Handles requests to routes that don't exist.

**Behavior:** Returns 404 JSON: `{ success: false, message: "Route GET /api/whatever not found" }`

**Connects to:** Registered in `server.js` after all routes, before `errorHandler`

---

### `backend/models/User.model.js`
**Purpose:** Mongoose schema and model for user accounts.

**Key behaviors:**
- `password` field has `select: false` — not included in queries unless explicitly requested
- `pre('save')` hook auto-hashes password with bcrypt (salt: 12) when modified
- `comparePassword(candidate)` instance method — uses `bcrypt.compare`
- `toPublicJSON()` — removes sensitive fields before sending to client
- 3 indexes: email (unique), role, createdAt

---

### `backend/models/Resume.model.js`
**Purpose:** Stores uploaded resume files' metadata and extracted content.

**Key fields:** `user`, `rawText`, `parsedData`, `atsScore`, `status`, `isPrimary`

**Indexes:** `{user, createdAt}`, `{user, isPrimary}`, `atsScore`

---

### `backend/models/Analysis.model.js`
**Purpose:** Stores AI analysis results. References both User and Resume.

**Key fields:** `atsScore`, `scoreBreakdown`, `strengths`, `weaknesses`, `missingSkills`, `suggestions`, `keywordsFound`, `keywordsMissing`, `aiModel`

---

### `backend/models/Interview.model.js`
**Purpose:** Stores complete interview sessions. Uses a nested `questionSchema`.

**Notable:** The `questionSchema` is defined separately and embedded as an array in the main schema. This allows each question to have its own `_id`.

---

### `backend/models/Job.model.js`
**Purpose:** Stores job listings for both recruiter-posted and AI-generated recommendations.

**Notable:** Has a full-text index on `title`, `description`, and `company.name` for keyword search.

---

### `backend/models/Feedback.model.js`
**Purpose:** Stores user feedback with optional links to specific content items.

---

### `backend/routes/*.routes.js`
**Pattern:** All route files follow the same structure:
1. Create `express.Router()`
2. Import controller functions
3. Import `{ protect, authorize }` from auth middleware
4. Define routes with method, path, optional middleware, and controller
5. Export the router

**Example — `auth.routes.js`:**
- `POST /register` → `register` (no auth)
- `POST /login` → `login` (no auth)
- `POST /guest-login` → `guestLogin` (no auth)
- `GET /me` → `protect`, `getMe`
- `PUT /profile` → `protect`, `updateProfile`
- `PUT /change-password` → `protect`, `changePassword`

---

### `backend/controllers/auth.controller.js`
**Purpose:** Handles user authentication and profile management.

**Functions:**
| Function | Route | Key Logic |
|----------|-------|-----------|
| `register` | POST /register | Validate → Check duplicate → Create user → generateToken → return |
| `login` | POST /login | Find user → comparePassword → generateToken → return |
| `guestLogin` | POST /guest-login | Find or create guest user → generateToken → return |
| `getMe` | GET /me | Find by `req.user._id` → return `toPublicJSON()` |
| `updateProfile` | PUT /profile | Merge profile/company fields → findByIdAndUpdate |
| `changePassword` | PUT /change-password | comparePassword → set new → save (triggers pre-save hash) → new token |

---

### `backend/controllers/resume.controller.js`
**Purpose:** Manages resume upload, listing, viewing, and deletion.

**Key function — `uploadResume`:**
1. Get file from `req.file` (Multer)
2. Call `resumeParser.parseResume(filePath)`
3. Create `Resume` document in MongoDB
4. Update `user.stats.resumesUploaded++`
5. Return resume data

---

### `backend/controllers/analysis.controller.js`
**Purpose:** Runs AI analysis on resumes and retrieves results.

**Key function — `analyzeResumeController`:**
1. Find Resume by `:resumeId`
2. Call `aiService.analyzeResume(rawText, jobTitle, jobDescription)`
3. Save result as `Analysis` document
4. Update `Resume.atsScore` and `Resume.latestAnalysis`
5. Update `User.stats.analysisCount` and `averageAtsScore`

---

### `backend/controllers/interview.controller.js`
**Purpose:** Creates sessions, handles answer submission/evaluation, and completion.

**Key functions:**
- `createSession` — Calls `aiService.generateInterviewQuestions()`, saves Interview
- `submitAnswer` — Calls `aiService.evaluateInterviewAnswer()`, updates specific question in array
- `completeSession` — Calculates overall score, updates status, updates user stats

---

### `backend/controllers/screening.controller.js`
**Purpose:** AI resume screening and skill gap analysis.

**Key functions:**
- `screenResumeController` — Calls `aiService.screenResume()`, returns verdict
- `skillGapController` — Calls `aiService.analyzeSkillGap()`, returns skill gap report
- `getUserResumes` — Returns user's resumes for the screening tool dropdown

---

### `backend/ecosystem.config.cjs`
**Purpose:** PM2 configuration for production deployment.

**Key settings:**
- `name: 'smart-resume-backend'`
- `script: 'server.js'`
- `exec_mode: 'fork'` (single instance)
- `watch: false` (don't restart on file changes in production)
- Log files: `./logs/error.log`, `./logs/out.log`

---

## 📁 Frontend Files

### `frontend/src/main.jsx`
**Purpose:** React application bootstrap.

**Key code:**
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

Attaches the React app to the `<div id="root">` in `index.html`. Imports `index.css` for global styles.

---

### `frontend/src/App.jsx`
**Purpose:** Root component with routing and global providers.

**Key components defined here:**
- `ProtectedRoute` — Redirects to `/login` if not authenticated; checks role if `requiredRole` prop given
- `PublicRoute` — Redirects authenticated users away from `/login`/`/register`
- `AppRoutes` — Renders all `<Route>` definitions
- `App` — Wraps everything in `AuthProvider`, `GlobalBackground`, `Router`, `Toaster`

**Route structure:**
- Public: `/`, `/login`, `/register`
- Protected (wrapped in `Layout`): all other routes

---

### `frontend/src/context/AuthContext.jsx`
**Purpose:** Global authentication state management using React Context API.

**State provided:**
- `user` — Current user object (null if logged out)
- `token` — JWT string from localStorage
- `loading` — True during initial auth check
- `isAuthenticated` — Derived: `!!user`
- `isGuest` — Derived: email includes `guest_`
- `isRecruiter` — Derived: role is `recruiter` or email has `guest_`
- `isAdmin` — Derived: role is `admin`

**Functions provided:**
- `register(userData)`, `login(credentials)`, `guestLogin(role)`, `logout()`, `updateUser(updatedUser)`

**On mount:** Calls `authAPI.getMe()` with a 5-second timeout to validate stored token

---

### `frontend/src/services/api.js`
**Purpose:** Centralized Axios instance and all API endpoint functions.

**Key features:**
- Base URL: `import.meta.env.VITE_API_URL || '/api'`
- **Request interceptor:** Auto-adds `Authorization: Bearer <token>` header
- **Response interceptor:** On 401 → clears localStorage → redirects to `/login`

**Exported API namespaces:** `authAPI`, `resumeAPI`, `analysisAPI`, `jobsAPI`, `interviewAPI`, `dashboardAPI`, `feedbackAPI`, `recruiterAPI`, `screeningAPI`

---

### `frontend/index.html`
**Purpose:** The HTML shell that Vite serves. Contains the root `<div id="root">`.

**Key elements:**
- `<meta>` tags for charset, viewport
- `<title>Smart AI Resume Analyzer</title>`
- `<script type="module" src="/src/main.jsx">` — Vite's entry point

---

### `frontend/src/index.css`
**Purpose:** Global CSS including CSS custom properties (variables), base resets, and animations.

**Contains:**
- Color scheme variables (`--background`, `--primary`, `--card`, etc.)
- Tailwind `@base`, `@components`, `@utilities` directives
- Custom animations: `fadeIn`, `slideUp`, `shimmer`
- Scrollbar styling

---

## 📋 Summary

Every file has a single, well-defined responsibility. Backend files follow MVC strictly — routes delegate to controllers, controllers use models and utilities. Frontend files follow the React pattern — pages use hooks and services, components are reusable UI pieces, context provides global state. All communication between frontend and backend flows through `api.js` → Express routes → controllers.

---

*Next: See [LINE_BY_LINE_EXPLANATION.md](./LINE_BY_LINE_EXPLANATION.md) for block-by-block code explanations.*
