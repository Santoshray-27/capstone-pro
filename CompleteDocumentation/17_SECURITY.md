# SECURITY — Smart AI Resume Analyzer

This document explains all security measures implemented in the project.

---

## 🔐 Authentication Security

### JWT (JSON Web Tokens)

**Implementation:** `utils/generateToken.js` + `middleware/auth.middleware.js`

```javascript
// Token creation
jwt.sign(
  { id: userId, role, isDemo },
  process.env.JWT_SECRET,
  { expiresIn: '7d', issuer: 'smart-resume-analyzer', audience: 'smart-resume-analyzer-api' }
)

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Security measures:**
- **Short expiry (7 days):** Limits the window if a token is stolen.
- **Issuer + Audience claims:** Extra validation layers — tokens from other services won't be accepted.
- **JWT_SECRET:** Must be a long, random, unpredictable string (32+ characters). Stored only in `.env`.

**Weakness acknowledged:** JWTs can't be invalidated server-side before expiry. A compromised token remains valid until it expires. **Improvement:** Implement token blacklisting using Redis or a short-lived token (15 minutes) + refresh token pattern.

---

### Password Hashing

**Implementation:** `models/User.model.js`

```javascript
const salt = await bcrypt.genSalt(12); // 12 salt rounds
this.password = await bcrypt.hash(this.password, salt);
```

**Why it's secure:**
- **Salt:** bcrypt generates a unique random salt for each password hash. Same password → different hash each time.
- **12 rounds:** 2^12 = 4096 iterations of hashing. Makes brute force attacks extremely slow (~100ms per attempt).
- **`select: false`:** Password field is never returned in queries unless explicitly requested with `.select('+password')`.

---

### Role-Based Access Control (RBAC)

**Implementation:** `middleware/auth.middleware.js` → `authorize()` function

```javascript
// Only recruiters and admins can create jobs
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
```

**Roles:**
- `jobseeker` — Default role; can't post jobs or access recruiter features
- `recruiter` — Can post/edit/delete jobs + access recruiter dashboard
- `admin` — Full access including admin stats

**403 vs 401:** Returns `403 Forbidden` (not `401`) when a user is authenticated but lacks the required role — correct HTTP semantics.

---

## 🛡️ API Security

### Helmet.js

**Implementation:** `server.js`

```javascript
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
```

Helmet sets these HTTP headers automatically:

| Header | Protection |
|--------|-----------|
| `Content-Security-Policy` | Prevents XSS by restricting script sources |
| `X-Frame-Options: DENY` | Prevents clickjacking (embedding page in iframes) |
| `X-Content-Type-Options: nosniff` | Prevents MIME type sniffing attacks |
| `Referrer-Policy` | Controls referer header information leakage |
| `X-XSS-Protection` | Legacy XSS protection in older browsers |
| `Strict-Transport-Security` | Forces HTTPS in production |

---

### CORS Configuration

**Implementation:** `server.js`

```javascript
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Why this is secure:**
- **Whitelist-only origins:** Only the frontend URL and known dev ports can make requests. Arbitrary origins are blocked.
- **Limited HTTP methods:** No unusual methods like `TRACE` or `CONNECT` are allowed.
- **Limited headers:** Only `Content-Type` and `Authorization` — prevents header injection.

**Improvement needed:** Remove `http://localhost:3000` in production settings.

---

### Request Size Limits

**Implementation:** `server.js`

```javascript
app.use(express.json({ limit: '50mb' }));
```

**Why:** Prevents DoS (Denial of Service) attacks that send huge JSON payloads to exhaust server memory. 50MB is generous for resume text; could be reduced to `5mb` if only resume data is sent.

---

### File Upload Security

**Implementation:** `middleware/upload.middleware.js`

```javascript
const allowedMimetypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const allowedExtensions = ['.pdf', '.doc', '.docx'];

// BOTH MIME type AND extension must match
if (allowedMimetypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
  cb(null, true);
} else {
  cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
}
```

**Why double-check?** Attackers can change a file's extension or spoof MIME types. Checking both reduces the chance of malicious files (e.g., an executable disguised as a PDF) being uploaded.

**Additional security:** Files are stored in user-specific subdirectories (`uploads/{userId}/`) with system-generated names — not the original user-provided filename (which could contain path traversal attacks like `../../etc/passwd`).

---

## 🔑 Secret Management

**Current implementation:** All secrets stored in `backend/.env`

| Secret | Location | Risk if Exposed |
|--------|----------|----------------|
| `MONGODB_URI` | `.env` | Database access — all user data compromised |
| `JWT_SECRET` | `.env` | Can forge tokens for any user |
| `GEMINI_API_KEY` | `.env` | API abuse, billing charges |
| `OPENAI_API_KEY` | `.env` | API abuse, high billing charges |

**Security measures:**
- `.env` is in `.gitignore` — never committed to git
- `.env.example` uses placeholder values only

**Improvement:** In production, use a secrets manager (AWS Secrets Manager, HashiCorp Vault, or Railway's environment variables) instead of `.env` files.

---

## ✅ Input Validation

**Current validation approach:**

1. **Mongoose schema validation** — Type checking and required fields enforced at database level:
   ```javascript
   email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ }
   password: { type: String, minlength: 6 }
   ```

2. **Controller-level validation** — Manual checks before database operations:
   ```javascript
   if (!name || !email || !password) {
     return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
   }
   ```

3. **File validation** — MIME type + extension check in upload middleware.

**Missing validation (improvement needed):**
- No `express-validator` or `joi` for comprehensive input sanitization
- No HTML/script injection sanitization for text inputs
- No rate limiting on sensitive endpoints (login, register)

---

## 🚧 Potential Security Improvements

| Area | Current State | Recommended Improvement |
|------|--------------|------------------------|
| **Rate limiting** | None | Add `express-rate-limit` to limit login attempts to 5/15min |
| **Input sanitization** | Basic | Use `express-validator` or `joi` for all inputs |
| **SQL Injection** | N/A (MongoDB) | Mongoose parameterizes queries by default — safe |
| **NoSQL Injection** | Partial | Validate that inputs are strings, not objects (e.g., `{ $gt: "" }` attacks) |
| **Token refresh** | None | Add refresh token endpoint for better session management |
| **HTTPS** | Platform-level | Ensure production deployment uses HTTPS |
| **Password reset** | Not implemented | `passwordResetToken` field exists in schema but endpoint not implemented |
| **Email verification** | Not implemented | `isEmailVerified` field exists but not enforced |
| **File scanning** | None | Add antivirus scan for uploaded PDFs before parsing |
| **Logging** | Console only | Add structured logging (Winston/Pino) with log rotation |
| **CSRF protection** | None | Add CSRF tokens if cookie-based auth is used |
| **Secret rotation** | Manual | Set up automated secret rotation policy |

---

## 📋 Security Summary

**Strengths:**
- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT-based stateless authentication
- ✅ RBAC for protected routes
- ✅ Helmet.js security headers
- ✅ CORS whitelist
- ✅ File type double-validation
- ✅ Secrets in environment variables (never in code)
- ✅ Password excluded from API responses (`select: false`)
- ✅ Production error messages hide stack traces

**Gaps to address:**
- ❌ No rate limiting
- ❌ No comprehensive input sanitization library
- ❌ No refresh token mechanism
- ❌ Password reset flow not implemented
- ❌ Email verification not enforced

---

*Next: See [ERROR_HANDLING_AND_VALIDATION.md](./ERROR_HANDLING_AND_VALIDATION.md) for error handling details.*
