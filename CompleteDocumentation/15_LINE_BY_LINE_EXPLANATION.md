# LINE BY LINE EXPLANATION — Smart AI Resume Analyzer

This document explains key source files block-by-block. For large files, important logic blocks are explained in detail.

---

## 📄 File: `backend/server.js`

```javascript
// Lines 1-4: File header comment
/**
 * Smart AI Resume Analyzer - Main Server Entry Point
 * Production-ready Express.js backend with MongoDB
 */
```
**Why:** Good documentation practice — every file should explain its purpose.

---

```javascript
// Lines 6-11: Core imports
const express = require('express');  // Web framework
const cors = require('cors');         // Cross-Origin Resource Sharing
const helmet = require('helmet');     // HTTP security headers
const morgan = require('morgan');     // Request logger
const path = require('path');         // File path utilities (built-in)
require('dotenv').config();           // Load .env into process.env IMMEDIATELY
```
**Why:** `dotenv.config()` must be called before any other code reads `process.env` variables. Using `require('dotenv').config()` at line 11 ensures all imports below can access env variables.

---

```javascript
// Lines 14-29: Route and middleware imports
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
// ... (all 9 route imports)
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
```
**Why:** Organized imports in logical groups — config first, routes, then middleware. This makes the file easy to scan.

---

```javascript
// Lines 31-35: App initialization
const app = express();
connectDB();
```
**Why:** `app` is the Express application object. `connectDB()` is called immediately so MongoDB is connected before any request comes in. There's no `await` because `connectDB()` handles its own async execution and errors internally.

---

```javascript
// Lines 40-42: Helmet configuration
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
```
**Why:** `helmet()` sets 11 security headers. The `crossOriginResourcePolicy: 'cross-origin'` override is needed because default Helmet blocks cross-origin resource loading, which would prevent the frontend from loading uploaded resume files served by the backend.

---

```javascript
// Lines 47-56: CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```
**Why:** CORS must explicitly list allowed origins. `credentials: true` allows cookies if used. `Authorization` header must be in `allowedHeaders` because we send JWT tokens in it. Multiple localhost ports are listed to support different frontend dev setups.

---

```javascript
// Lines 61-62: Request parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```
**Why:** Without `express.json()`, `req.body` would be `undefined` for JSON requests. `limit: '50mb'` allows large payloads (e.g., resume text being sent for analysis). `express.urlencoded` handles form-encoded data.

---

```javascript
// Lines 67-69: Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```
**Why:** Request logging is useful in development to see exactly what API calls are being made. In production, it would create huge log files — so it's gated on `NODE_ENV`.

---

```javascript
// Lines 79-87: Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '...', environment: ..., timestamp: ..., version: '1.0.0' });
});
```
**Why:** A `/api/health` endpoint is a best practice for:
- Deployment health checks (Railway, Render ping this)
- Quickly verifying the API is running without a browser
- Monitoring tools

---

```javascript
// Lines 105-112: Frontend serving
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
if (require('fs').existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}
```
**Why:** In production, the built React app (a folder of HTML/JS/CSS files) is served directly by Express. The wildcard `*` route sends `index.html` for any non-API path — this supports React Router's client-side routing. The `if req.path.startsWith('/api')` check ensures API calls are not intercepted by this catch-all.

---

```javascript
// Lines 139-150: Process-level error handling
process.on('unhandledRejection', (err) => {
  server.close(() => process.exit(1));
});
process.on('uncaughtException', (err) => {
  process.exit(1);
});
```
**Why:** Without these handlers, a promise rejection that isn't caught anywhere would crash the server silently (or with a cryptic warning). These handlers ensure the server fails loudly and cleanly, enabling process managers like PM2 to restart it.

---

## 📄 File: `backend/utils/aiService.js` (Key Blocks)

```javascript
// Lines 13-53: callGemini function
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not configured');
  }
  const fetch = require('node-fetch'); // Required here to avoid ESM/CJS issues
```
**Why:** `node-fetch` v2 is CommonJS compatible. Importing it at the top level can cause issues in some Node.js versions, so it's required inside the function. The API key placeholder check prevents misleading errors.

---

```javascript
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,  // High randomness for unique responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    }),
    timeout: 45000  // 45-second timeout
  });
```
**Why:** `temperature: 0.9` makes AI responses more varied and specific to each resume, avoiding generic feedback. `maxOutputTokens: 4096` allows detailed responses. `timeout: 45000` prevents requests from hanging indefinitely.

---

```javascript
// Lines 144-182: callAI fallback chain
const callAI = async (prompt) => {
  // 1. Try Gemini first
  try {
    const result = await callGemini(prompt);
    return { text: result, model: 'gemini' };
  } catch (geminiError) {
    console.warn('⚠️ Gemini failed:', geminiError.message);
  }

  // 2. Try OpenAI second
  try {
    const result = await callOpenAI(prompt);
    return { text: result, model: 'openai' };
  } catch (openaiError) { ... }

  // 3. Try Groq third
  try { ... } catch (groqError) { ... }

  return null; // All failed
};
```
**Why:** The waterfall pattern tries each provider sequentially. This is better than parallel because:
1. We don't waste money calling all 3 providers simultaneously
2. Provider failure is handled gracefully
3. Controllers receive a consistent `{text, model}` object regardless of which AI responded

---

```javascript
// Lines 187-230: parseAIJson function
const parseAIJson = (text) => {
  // 1. Try JSON in markdown code blocks: ```json { ... } ```
  const jsonMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)```/);
  
  // 2. Try direct JSON.parse
  try { return JSON.parse(cleanText); } catch (e) {}
  
  // 3. Find first { and last }
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (lastBrace > firstBrace) {
    try { return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1)); } catch (e) {}
  }
  
  return null;
};
```
**Why:** AI models sometimes wrap JSON in markdown code blocks (````json ... ````), add explanatory text before/after, or slightly malform the JSON. These 4 strategies handle the most common AI output variations robustly. Without this, many valid AI responses would fail to parse.

---

## 📄 File: `backend/middleware/auth.middleware.js` (Key Blocks)

```javascript
// Lines 12-104: protect middleware
const protect = async (req, res, next) => {
  let token;

  // Extract from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Also check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
```
**Why:** Supports two token delivery methods: `Authorization: Bearer <token>` header (used by our Axios client) and cookies (for potential future browser-native flows). `.split(' ')[1]` extracts just the token from `"Bearer eyJ..."`.

---

```javascript
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decoded.id).select('-password');
```
**Why:** `jwt.verify` both verifies the signature AND decodes the payload. If the token was tampered with or signed with a different secret, it throws `JsonWebTokenError`. `.select('-password')` excludes the hashed password from being attached to `req.user` (security best practice).

---

```javascript
  // Demo mode fallback
  if (!user && decoded.isDemo && process.env.NODE_ENV === 'development') {
    user = {
      _id: decoded.id,
      role: decoded.role,
      name: 'Demo Guest',
      isActive: true,
      toPublicJSON: () => ({ ... })
    };
  }
```
**Why:** When the database is not connected, demo/guest tokens would fail the `User.findById()` check. This creates a temporary mock user object for development testing without a DB.

---

```javascript
// Lines 110-128: authorize factory
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ ... });
    }
    next();
  };
};
```
**Why:** This is a "middleware factory" — a function that returns a middleware function. Usage: `authorize('recruiter', 'admin')` returns a middleware that checks if the user's role is in the array. The `403 Forbidden` (not 401) response is correct because the user IS authenticated but NOT authorized.

---

## 📄 File: `frontend/src/services/api.js` (Key Blocks)

```javascript
// Lines 11-17: Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,  // '/api' or VITE_API_URL
  timeout: 30000,         // 30-second request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
```
**Why:** Creating a configured Axios instance means all API calls automatically get the base URL and default headers. Every call doesn't need to manually set these.

---

```javascript
// Lines 22-31: Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```
**Why:** An interceptor runs before every request. This automatically attaches the stored JWT token to every API call. Without this, every single API call would need to manually add the Authorization header — extremely repetitive and error-prone.

---

```javascript
// Lines 37-50: Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```
**Why:** When a JWT expires and the backend returns 401, we want to automatically log the user out and redirect to login. The `currentPath` check prevents infinite redirect loops (if the login page itself made an auth request that returned 401, we don't want to redirect again).

---

## 📄 File: `frontend/src/context/AuthContext.jsx` (Key Blocks)

```javascript
// Lines 19-46: initAuth effect
useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Race between auth check and 5-second timeout
        const authPromise = authAPI.getMe();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 5000)
        );
        const { data } = await Promise.race([authPromise, timeoutPromise]);
```
**Why:** On page load, we check if a stored token is still valid by calling `/api/auth/me`. The `Promise.race` pattern adds a 5-second timeout to prevent the app from being stuck in loading state if the backend is slow. If auth check takes more than 5 seconds, we clear auth and let the user try again.

---

```javascript
// Lines 100-103: Logout
const logout = useCallback(() => {
  clearAuth();
  window.location.href = '/login';
}, []);
```
**Why:** `window.location.href = '/login'` instead of `navigate('/login')` forces a full page reload. This ensures all component state is cleared after logout — no stale data from the previous session remains in memory. `useCallback` with empty deps ensures `logout` has a stable reference (won't cause re-renders).

---

## 📄 File: `backend/models/User.model.js` (Key Blocks)

```javascript
// Lines 82-89: Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```
**Why:** `if (!this.isModified('password')) return next()` is critical — without this check, EVERY save operation (like updating a user's bio) would re-hash an already-hashed password, making it impossible to log in. The `pre('save')` middleware only runs the hash when the password field actually changed. Salt rounds of 12 provides strong security while remaining computationally feasible.

---

```javascript
// Lines 96-98: comparePassword method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```
**Why:** Since `password` has `select: false`, you normally can't access it. This method is called after explicitly selecting the password field (`User.findOne(...).select('+password')`). `bcrypt.compare` handles the salt automatically — it's embedded in the stored hash.

---

## 📄 File: `backend/utils/resumeParser.js` (Key Blocks)

```javascript
// Lines 46-119: PATTERNS and SKILL_KEYWORDS
const PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(?:\+?1[-.\s]?)?.../, 
  sections: {
    experience: /(?:^|\n)\s*(?:EXPERIENCE|WORK EXPERIENCE|...)[\s:]*\n/im,
    ...
  }
};
```
**Why:** Centralizing all regex patterns in a single object makes them easy to maintain and update. The section patterns use `(?:^|\n)` to match at the start of a line, and `[\s:]*\n` to handle variations like "EXPERIENCE:" or "EXPERIENCE\n".

---

```javascript
// Lines 162-175: Skill extraction
const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  const foundSkills = new Set();

  ALL_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundSkills.add(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  });

  return [...foundSkills].slice(0, 30);
};
```
**Why:** `Set` prevents duplicate skills. The regex special character escaping (`replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) is crucial because skill names like "C++" or "ASP.NET" contain regex special characters that would break the pattern. Word boundaries (`\b`) ensure we don't match "CSS" inside "accessible" — we only match whole words.

---

## 📋 Summary

The codebase is well-structured with clear separation of concerns. Key patterns to note:

1. **Express middleware chain** — each `next()` call passes to the next middleware
2. **Mongoose pre-save hooks** — run before `.save()` for password hashing
3. **AI fallback chain** — try/catch waterfall for provider resilience
4. **Axios interceptors** — global request/response transformation
5. **JWT token lifecycle** — sign on login, verify on each request, auto-logout on 401
6. **Regex-based parsing** — robust pattern matching for resume data extraction

---

*Next: See [CONFIG_FILES_EXPLANATION.md](./CONFIG_FILES_EXPLANATION.md) for configuration file details.*
