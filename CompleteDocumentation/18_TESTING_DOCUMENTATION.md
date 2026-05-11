# TESTING DOCUMENTATION — Smart AI Resume Analyzer

---

## ⚠️ Current Testing Status

> **No automated test framework is currently configured.**

The backend `package.json` shows:
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

The `test-ai.js` file in the backend is a **manual test script** for quickly verifying AI connectivity, not a formal test suite.

---

## 🧪 `backend/test-ai.js` — Manual Test Script

**Purpose:** Quickly test that the AI service is working with your configured API keys.

**How to run:**
```bash
cd backend
node test-ai.js
```

**What it does:** Calls the AI service with a sample prompt and logs the response. Useful for verifying API key configuration.

---

## 📋 What Should Be Tested

Here is a comprehensive list of test cases that should be written for this project:

### Backend Unit Tests

#### `utils/aiService.js`
- [ ] `parseAIJson` — correctly parses JSON from markdown code blocks
- [ ] `parseAIJson` — correctly parses raw JSON objects
- [ ] `parseAIJson` — returns null for unparseable text
- [ ] `callAI` — falls back to OpenAI when Gemini fails (mock API)
- [ ] `callAI` — falls back to Groq when both Gemini and OpenAI fail
- [ ] `callAI` — returns null when all providers fail

#### `utils/resumeParser.js`
- [ ] `extractContactInfo` — correctly extracts email from text
- [ ] `extractContactInfo` — correctly extracts phone numbers
- [ ] `extractContactInfo` — correctly extracts LinkedIn URLs
- [ ] `extractSkills` — finds "React" in a resume containing "React.js experience"
- [ ] `extractSkills` — doesn't match partial words (e.g., "CSS" in "accessible")
- [ ] `extractExperience` — correctly identifies experience section
- [ ] `extractEducation` — correctly identifies education entries
- [ ] `parseResume` — handles PDF file correctly
- [ ] `parseResume` — handles DOCX file correctly
- [ ] `parseResume` — throws error for insufficient text

#### `utils/generateToken.js`
- [ ] `generateToken` — returns a valid JWT string
- [ ] Generated token decodes to correct `id` and `role`
- [ ] Token expires correctly after configured period

#### `middleware/auth.middleware.js`
- [ ] `protect` — passes request when valid token present
- [ ] `protect` — returns 401 when no token
- [ ] `protect` — returns 401 when token is expired
- [ ] `protect` — returns 401 when token has invalid signature
- [ ] `authorize('recruiter')` — passes for recruiter user
- [ ] `authorize('recruiter')` — returns 403 for jobseeker user

#### `middleware/errorHandler.js`
- [ ] Returns 400 for Mongoose ValidationError with field details
- [ ] Returns 400 for CastError
- [ ] Returns 400 for duplicate key error
- [ ] Returns 401 for JsonWebTokenError
- [ ] Hides stack trace in production mode
- [ ] Includes stack trace in development mode

### Backend Integration Tests

#### Auth Controller
- [ ] POST `/api/auth/register` — creates user with hashed password
- [ ] POST `/api/auth/register` — returns 400 for duplicate email
- [ ] POST `/api/auth/register` — returns 400 for missing fields
- [ ] POST `/api/auth/login` — returns token for valid credentials
- [ ] POST `/api/auth/login` — returns 401 for wrong password
- [ ] GET `/api/auth/me` — returns user for valid token
- [ ] GET `/api/auth/me` — returns 401 without token
- [ ] PUT `/api/auth/change-password` — updates password successfully

#### Resume Controller
- [ ] POST `/api/resumes/upload` — accepts valid PDF
- [ ] POST `/api/resumes/upload` — rejects non-PDF/DOCX files
- [ ] POST `/api/resumes/upload` — rejects files over 10MB
- [ ] GET `/api/resumes` — returns only current user's resumes
- [ ] DELETE `/api/resumes/:id` — deletes resume and file
- [ ] DELETE `/api/resumes/:id` — returns 404 for another user's resume

#### Job Controller
- [ ] GET `/api/jobs` — returns all active jobs (no auth)
- [ ] POST `/api/jobs` — creates job for recruiter role
- [ ] POST `/api/jobs` — returns 403 for jobseeker role

### Frontend Component Tests

Using **React Testing Library** + **Vitest**:

#### `AuthContext.jsx`
- [ ] `login()` — stores token in localStorage on success
- [ ] `logout()` — clears token from localStorage
- [ ] `isAuthenticated` — true when user is set, false when null
- [ ] Initial auth check — calls `/api/auth/me` on mount
- [ ] Handles auth timeout — clears auth if request takes >5s

#### `api.js`
- [ ] Request interceptor — attaches Bearer token header
- [ ] Response interceptor — redirects to /login on 401

#### `ProtectedRoute` (from App.jsx)
- [ ] Renders children when authenticated
- [ ] Redirects to /login when not authenticated
- [ ] Shows loading spinner while auth check is in progress

---

## 🛠️ Recommended Test Setup

### Backend Testing Setup

```bash
cd backend
npm install --save-dev jest supertest
```

**`backend/jest.config.js`:**
```javascript
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
```

**Example test file — `__tests__/auth.test.js`:**
```javascript
const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: 'password123' });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test' }); // missing email and password
    
    expect(res.status).toBe(400);
  });
});
```

**Updated `package.json`:**
```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

---

### Frontend Testing Setup

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**`frontend/vite.config.js`** — add test config:
```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
})
```

**`frontend/src/test/setup.js`:**
```javascript
import '@testing-library/jest-dom';
```

**Example test — `AuthContext.test.jsx`:**
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { isAuthenticated } = useAuth();
  return <div>{isAuthenticated ? 'Logged In' : 'Logged Out'}</div>;
};

test('shows logged out when no token', async () => {
  localStorage.clear();
  render(<AuthProvider><TestComponent /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('Logged Out')).toBeInTheDocument());
});
```

---

## 📊 Test Coverage Priorities

| Priority | Area | Reason |
|----------|------|--------|
| 🔴 Critical | Auth flow (register, login, JWT) | Core security |
| 🔴 Critical | `protect` middleware | Every protected route depends on this |
| 🔴 Critical | Resume upload + parsing | Core feature |
| 🟡 High | `parseAIJson` utility | Brittle — AI responses vary widely |
| 🟡 High | Error handler | Must return consistent format |
| 🟢 Medium | Job CRUD | Standard CRUD |
| 🟢 Medium | Dashboard stats | Aggregation logic |
| ⚪ Low | Frontend pages | UI behavior changes often |

---

## 📋 Summary

- **Current state:** No automated tests; only a manual `test-ai.js` script.
- **Recommended:** Add Jest + Supertest for backend, Vitest + React Testing Library for frontend.
- **Critical gaps:** Authentication middleware, resume parser, and error handler should be tested first.
- **Target coverage:** Aim for 70%+ on backend utilities and controllers before shipping to production.

---

*Next: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment instructions.*
