# ERROR HANDLING AND VALIDATION — Smart AI Resume Analyzer

---

## 🛡️ Error Handling Architecture

The project uses a **centralized error handling** approach:

```
Controller throws error
  → next(error) passes it to Express error chain
  → errorHandler.js catches ALL errors
  → Returns consistent JSON response
```

This means controllers don't need individual error response code — they just `throw` or call `next(error)`.

---

## 📄 Global Error Handler (`middleware/errorHandler.js`)

The error handler catches all errors and maps them to appropriate HTTP responses.

### Error Types Handled

#### 1. Mongoose Validation Error
**When:** A required field is missing or a field fails schema validation.
```javascript
if (err.name === 'ValidationError') {
  statusCode = 400;
  message = 'Validation Error';
  errors = Object.values(err.errors).map(val => ({
    field: val.path,
    message: val.message
  }));
}
```
**Response:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

#### 2. Mongoose CastError (Invalid ObjectId)
**When:** `:id` in URL is not a valid MongoDB ObjectId (e.g., `/api/resumes/invalid-id`).
```javascript
if (err.name === 'CastError') {
  statusCode = 400;
  message = `Invalid ${err.path}: ${err.value}`;
}
```
**Why:** Prevents a 500 server error when users mistype or manipulate URL IDs.

#### 3. MongoDB Duplicate Key (Error Code 11000)
**When:** User tries to register with an already-used email.
```javascript
if (err.code === 11000) {
  const field = Object.keys(err.keyValue)[0];
  message = `${field} already exists`;
}
```

#### 4. JWT Errors
```javascript
if (err.name === 'JsonWebTokenError') {
  statusCode = 401;
  message = 'Invalid token. Please login again.';
}
if (err.name === 'TokenExpiredError') {
  statusCode = 401;
  message = 'Token expired. Please login again.';
}
```

#### 5. Multer File Upload Errors
```javascript
if (err.code === 'LIMIT_FILE_SIZE') {
  statusCode = 400;
  message = `File too large. Maximum size is ${...}MB`;
}
```

#### 6. Development vs Production Behavior

**Development mode:** Includes full stack trace in response:
```json
{
  "success": false,
  "message": "Something went wrong",
  "stack": "Error: Something went wrong\n    at ...",
  "originalError": "Something went wrong"
}
```

**Production mode:** Stack trace is hidden — never expose internal error details to users.

---

## 🔍 404 Handler (`middleware/notFound.js`)

```javascript
const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.method} ${req.path} not found`);
  error.statusCode = 404;
  next(error); // Passes to errorHandler
};
```

**Why use `next(error)` instead of `res.json()` directly?** This ensures the 404 response also goes through the global error handler, maintaining consistency in response format.

---

## ✅ Validation Approach

### Backend Validation

**Layer 1 — Controller-level checks:**
Manual validation before database operations.

```javascript
// auth.controller.js
if (!name || !email || !password) {
  return res.status(400).json({
    success: false,
    message: 'Please provide name, email, and password'
  });
}

if (newPassword.length < 6) {
  return res.status(400).json({
    success: false,
    message: 'New password must be at least 6 characters'
  });
}
```

**Layer 2 — Mongoose Schema validation:**
Enforced at database level — catches anything the controller missed.

```javascript
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  lowercase: true,
  match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
},
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [6, 'Password must be at least 6 characters']
}
```

**Layer 3 — File validation (Multer):**
MIME type + extension checking in upload middleware.

**Layer 4 — Business logic validation:**
```javascript
// Prevent users from accessing other users' resumes
const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
if (!resume) return res.status(404).json({ ... });
```
The `user: req.user._id` in the query ensures users can only access their own data.

---

### Frontend Validation

**Form validation:** HTML5 built-in validation (`required`, `type="email"`, `minLength`) + JavaScript checks before calling the API.

**Toast notifications:** Errors from API calls are displayed via `react-hot-toast`:
```javascript
try {
  const result = await resumeAPI.upload(formData);
  toast.success('Resume uploaded successfully!');
} catch (error) {
  toast.error(error.response?.data?.message || 'Upload failed');
}
```

**Automatic logout on 401:** The Axios response interceptor in `api.js` catches 401 responses and redirects to `/login`:
```javascript
if (error.response?.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
```

---

## 📊 Logging

### Current Logging

| What | How | When |
|------|-----|------|
| HTTP requests | Morgan `dev` format | Development only |
| MongoDB connection | `console.log` | Startup |
| AI provider attempts | `console.log` / `console.warn` | Every AI call |
| Controller errors | `console.error` + `next(error)` | On any error |
| 5xx errors | `console.error` in errorHandler | Production only for 5xx |
| Server startup banner | `console.log` box | Startup |

### Logging Example Output
```
GET /api/auth/me 200 45ms
--- AI Analysis Attempt ---
Checking Keys: { gemini: true, openai: false, groq: false }
✅ AI Response from Gemini
```

### Missing (Improvement Needed)
- No structured logging (JSON format for log aggregation tools)
- No log levels (debug/info/warn/error)
- No log files (only console output)
- No request ID tracking for correlating logs
- No log rotation

**Recommended:** Add `winston` or `pino` for production-grade logging.

---

## 🔴 AI Error Handling

AI errors are handled at multiple levels:

```javascript
// aiService.js: Each provider wrapped in try/catch
try {
  const result = await callGemini(prompt);
  return { text: result, model: 'gemini' };
} catch (geminiError) {
  console.warn('⚠️ Gemini failed:', geminiError.message);
  // Falls through to next provider
}

// If all providers fail:
return null; // Returns null, not an error

// Controller handles null:
if (!aiResult) {
  throw new Error('AI providers are currently unavailable. Please check your API keys or quota.');
}
```

**Why return `null` instead of throwing?** `callAI()` is responsible for trying all providers. Throwing would prevent the fallback from running. `null` signals "all failed, caller decides what to do."

---

## 💡 Error Handling Improvements Recommended

| Area | Issue | Solution |
|------|-------|---------|
| **Rate limiting** | No protection against brute force | Add `express-rate-limit` (5 attempts/15min for login) |
| **Input sanitization** | No XSS protection on text fields | Add `express-validator` for all text inputs |
| **AI timeout** | 45s timeout may be too long for UX | Add streaming responses or reduce to 20s with user feedback |
| **File error recovery** | Uploaded file not cleaned up on parse failure | Delete file in catch block when parsing fails |
| **Structured logging** | Console only | Add Winston with file transports and log rotation |
| **Error IDs** | No way to trace specific errors | Add unique error IDs to responses for debugging |
| **Frontend errors** | Some errors might not show toast | Add global error boundary in React |

---

## 📋 Summary

The error handling is **centralized and consistent** — all errors funnel through `errorHandler.js` which returns a uniform JSON structure. Validation happens at two levels: controller (fast feedback) and Mongoose (schema enforcement). Logging is basic but functional for development. The AI error handling is robust with a 3-provider fallback chain. Key improvements needed are rate limiting, input sanitization, and structured logging for production readiness.

---

*Next: See [TESTING_DOCUMENTATION.md](./TESTING_DOCUMENTATION.md) for testing details.*
