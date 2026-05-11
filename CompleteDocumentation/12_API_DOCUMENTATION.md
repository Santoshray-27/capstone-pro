# API DOCUMENTATION — ResumeXpert AI

All API endpoints are prefixed with `/api`. The backend runs at `http://localhost:5000` in development.

---

## 🔐 Authentication

Most endpoints require a **Bearer JWT token** in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained via login, register, or guest-login endpoints.

---

## 📋 Response Format

All responses follow this consistent JSON structure:

**Success:**
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Optional: field-level validation errors
}
```

---

## 🔑 Auth Routes `/api/auth`

### POST `/api/auth/register`
Register a new user account.

| Field | Value |
|-------|-------|
| **Auth Required** | No |
| **Method** | POST |

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "role": "jobseeker"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully! Welcome to ResumeXpert AI.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  }
}
```

---

### POST `/api/auth/login`
Login with email and password.

| Field | Value |
|-------|-------|
| **Auth Required** | No |
| **Method** | POST |

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "...",
  "user": { "_id": "...", "name": "John Doe", "role": "jobseeker" }
}
```

---

### POST `/api/auth/guest-login`
Get instant access as a guest.

| Field | Value |
|-------|-------|
| **Auth Required** | No |
| **Method** | POST |

**Request Body:**
```json
{
  "role": "jobseeker"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Welcome, Guest! You are logged in as a guest.",
  "token": "...",
  "user": { "_id": "...", "name": "Guest User", "role": "jobseeker" }
}
```

---

### GET `/api/auth/me`
Get the currently authenticated user's profile.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

---

### PUT `/api/auth/profile`
Update the authenticated user's profile info.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | PUT |

---

### PUT `/api/auth/change-password`
Change the authenticated user's password.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | PUT |

## 📄 Resume Routes `/api/resumes`

### POST `/api/resumes/upload`
Upload a resume file (PDF or DOCX). Automatically parses the content.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |
| **Content-Type** | `multipart/form-data` |

**Request:** Form data with file field named `resume`.
- Accepted types: `.pdf`, `.doc`, `.docx`
- Max size: 10MB (configurable via `MAX_FILE_SIZE`)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Resume uploaded and parsed successfully!",
  "resume": {
    "_id": "...",
    "title": "My Resume",
    "fileName": "resume-1234567890.pdf",
    "fileType": "pdf",
    "fileSize": 245120,
    "status": "parsed",
    "parsedData": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "(555) 123-4567",
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": [
        {
          "company": "Tech Inc",
          "role": "Software Engineer",
          "duration": "Jan 2022 - Present"
        }
      ],
      "education": [
        {
          "institution": "State University",
          "degree": "B.S. Computer Science",
          "year": "2021"
        }
      ]
    },
    "atsScore": null
  }
}
```

---

### GET `/api/resumes`
Get all resumes uploaded by the authenticated user.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "resumes": [ { ... }, { ... } ]
}
```

---

### GET `/api/resumes/:id`
Get a specific resume by its ID.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |
| **URL Param** | `:id` — MongoDB ObjectId of the resume |

---

### PUT `/api/resumes/:id`
Update resume title or set as primary.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | PUT |

**Request Body:**
```json
{
  "title": "My Updated Resume Title",
  "isPrimary": true
}
```

---

### DELETE `/api/resumes/:id`
Delete a resume and its file from disk.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | DELETE |

---

## 🧠 Analysis Routes `/api/analysis`

### POST `/api/analysis/analyze/:resumeId`
Run AI analysis on a resume.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |
| **URL Param** | `:resumeId` — MongoDB ObjectId of the resume |

**Request Body (optional):**
```json
{
  "jobTitle": "Senior React Developer",
  "jobDescription": "We're looking for a React expert..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume analyzed successfully!",
  "analysis": {
    "_id": "...",
    "atsScore": 73,
    "scoreBreakdown": {
      "formatting": 80,
      "keywords": 70,
      "experience": 75,
      "skills": 68,
      "education": 85,
      "overall": 73
    },
    "strengths": [
      "Strong React and Node.js experience clearly demonstrated",
      "Quantified achievements in experience section"
    ],
    "weaknesses": [
      "Summary section lacks specificity",
      "Missing cloud/AWS skills relevant to target role"
    ],
    "missingSkills": ["AWS", "Docker", "CI/CD"],
    "suggestions": [
      "Add measurable metrics to summary",
      "Include AWS certifications if applicable"
    ],
    "keywordsFound": ["React", "Node.js", "MongoDB"],
    "keywordsMissing": ["TypeScript", "REST API", "Agile"],
    "keywordDensity": 65,
    "industryMatch": 78,
    "aiModel": "gemini",
    "processingTime": 3420
  }
}
```

---

### GET `/api/analysis/my/all`
Get all analyses for the authenticated user.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

---

### GET `/api/analysis/resume/:resumeId`
Get all analyses for a specific resume.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

---

### GET `/api/analysis/:id`
Get a single analysis by its ID.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

---

## 💼 Job Routes `/api/jobs`

### GET `/api/jobs/recommendations`
Get AI-personalized job recommendations based on the user's resume.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

**Success Response (200):**
```json
{
  "success": true,
  "jobs": [
    {
      "title": "Senior React Developer",
      "company": "TechCorp Inc",
      "location": "San Francisco, CA",
      "type": "Full-time",
      "salary": "$120,000 - $150,000",
      "matchScore": 87,
      "requiredSkills": ["React", "TypeScript", "Node.js"],
      "description": "Join our team to build scalable web applications.",
      "whyMatch": "Your React and Node.js skills align perfectly.",
      "industry": "Software",
      "experienceLevel": "Senior"
    }
  ]
}
```

---

### GET `/api/jobs`
Browse all active job listings (public endpoint, no auth needed).

| Field | Value |
|-------|-------|
| **Auth Required** | No |
| **Method** | GET |

**Query Params:**
- `?search=react` — search by title/description
- `?category=Engineering` — filter by category
- `?page=1&limit=10` — pagination

---

### POST `/api/jobs`
Post a new job listing (recruiters and admins only).

| Field | Value |
|-------|-------|
| **Auth Required** | YES (role: `recruiter` or `admin`) |
| **Method** | POST |

**Request Body:**
```json
{
  "title": "Frontend Developer",
  "company": { "name": "StartupXYZ", "industry": "SaaS" },
  "description": "Build beautiful UIs...",
  "requiredSkills": ["React", "CSS", "JavaScript"],
  "location": { "city": "Remote", "isRemote": true },
  "salary": { "min": 80000, "max": 110000, "currency": "USD" },
  "employmentType": "full-time"
}
```

---

## 🎤 Interview Routes `/api/interviews`

### POST `/api/interviews/create`
Create a new AI-powered interview session.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "experienceLevel": "mid",
  "interviewType": "mixed",
  "questionCount": 10,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

`interviewType` options: `mixed`, `technical`, `behavioral`, `case-study`, `mcq-only`
`experienceLevel` options: `entry`, `junior`, `mid`, `senior`, `lead`, `manager`

**Success Response (201):**
```json
{
  "success": true,
  "interview": {
    "_id": "...",
    "title": "Software Engineer Interview",
    "jobTitle": "Software Engineer",
    "totalQuestions": 10,
    "questions": [
      {
        "_id": "...",
        "question": "Describe your experience with React hooks.",
        "format": "open-ended",
        "type": "technical",
        "difficulty": "medium",
        "options": []
      }
    ],
    "status": "draft"
  }
}
```

---

### POST `/api/interviews/:id/answer`
Submit an answer to a question and receive AI evaluation.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |
| **URL Param** | `:id` — Interview session ID |

**Request Body:**
```json
{
  "questionId": "...",
  "answer": "I use useState for local state and useEffect for side effects...",
  "questionIndex": 0
}
```

**Success Response (200):**
```json
{
  "success": true,
  "evaluation": {
    "score": 7,
    "feedback": "Good understanding of hooks. Could elaborate more on useCallback.",
    "strengths": ["Correct explanation of useState", "Good use of examples"],
    "improvements": ["Mention useCallback and useMemo", "Discuss performance implications"],
    "modelAnswer": "React hooks like useState manage component state...",
    "aiModel": "gemini"
  }
}
```

---

### POST `/api/interviews/:id/complete`
Complete the interview session and get final scores.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |

**Success Response (200):**
```json
{
  "success": true,
  "interview": {
    "overallScore": 72,
    "readinessLevel": "good",
    "topStrengths": ["Technical knowledge", "Clear communication"],
    "areasToImprove": ["Deeper system design knowledge"],
    "status": "completed"
  }
}
```

---

## 📊 Dashboard Routes `/api/dashboard`

### GET `/api/dashboard/stats`
Get analytics data for the authenticated user.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | GET |

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalResumes": 3,
    "totalAnalyses": 5,
    "totalInterviews": 2,
    "averageAtsScore": 74,
    "latestAnalyses": [ ... ],
    "scoreHistory": [
      { "date": "2024-01-15", "score": 65 },
      { "date": "2024-01-20", "score": 74 }
    ]
  }
}
```

---

## 🛡️ Screening Routes `/api/screening`

### POST `/api/screening/screen`
AI-powered resume screening against a job description.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |

**Request Body:**
```json
{
  "resumeId": "...",
  "jobTitle": "Backend Developer",
  "jobDescription": "Looking for a Node.js expert...",
  "requiredSkills": ["Node.js", "MongoDB", "REST APIs"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "screening": {
    "verdict": "shortlisted",
    "matchScore": 82,
    "summary": "Strong match. Candidate has relevant Node.js experience.",
    "strengths": ["Solid backend experience", "MongoDB expertise"],
    "redFlags": ["No Docker experience mentioned"],
    "skillsAnalysis": {
      "matched": ["Node.js", "MongoDB"],
      "missing": ["Docker"],
      "bonus": ["Kubernetes"]
    },
    "recommendation": "Strongly recommend for technical interview."
  }
}
```

---

### POST `/api/screening/skill-gap`
Analyze skill gaps between current resume and target role.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |

**Request Body:**
```json
{
  "resumeId": "...",
  "targetRole": "Senior DevOps Engineer",
  "experienceLevel": "senior"
}
```

---

## 💬 Feedback Routes `/api/feedback`

### POST `/api/feedback`
Submit feedback about the platform.

| Field | Value |
|-------|-------|
| **Auth Required** | YES |
| **Method** | POST |

**Request Body:**
```json
{
  "type": "feature-request",
  "title": "Add PDF comparison feature",
  "message": "It would be great to compare two resume versions side by side.",
  "rating": 4,
  "category": "suggestion",
  "isAnonymous": false
}
```

`type` options: `platform`, `resume-review`, `analysis`, `interview`, `feature-request`, `bug-report`, `other`

---

## ❤️ Health Check

### GET `/api/health`
Check if the API server is running.

| Field | Value |
|-------|-------|
| **Auth Required** | No |
| **Method** | GET |

**Success Response (200):**
```json
{
  "status": "OK",
  "message": "ResumeXpert AI API is running",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.2.0"
}
```

---

## 📋 Complete Route Summary

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/register` | No | — |
| POST | `/api/auth/login` | No | — |
| POST | `/api/auth/guest-login` | No | — |
| GET | `/api/auth/me` | Yes | Any |
| PUT | `/api/auth/profile` | Yes | Any |
| PUT | `/api/auth/change-password` | Yes | Any |
| POST | `/api/resumes/upload` | Yes | Any |
| GET | `/api/resumes` | Yes | Any |
| GET | `/api/resumes/:id` | Yes | Any |
| PUT | `/api/resumes/:id` | Yes | Any |
| DELETE | `/api/resumes/:id` | Yes | Any |
| POST | `/api/analysis/analyze/:resumeId` | Yes | Any |
| GET | `/api/analysis/my/all` | Yes | Any |
| GET | `/api/analysis/:id` | Yes | Any |
| GET | `/api/jobs/recommendations` | Yes | Any |
| POST | `/api/interviews/create` | Yes | Any |
| POST | `/api/interviews/:id/answer` | Yes | Any |
| POST | `/api/interviews/:id/complete` | Yes | Any |
| GET | `/api/dashboard/stats` | Yes | Any |
| POST | `/api/feedback` | Yes | Any |

| GET | `/api/interviews/:id` | Yes | Any |
| POST | `/api/interviews/:id/answer` | Yes | Any |
| POST | `/api/interviews/:id/complete` | Yes | Any |
| GET | `/api/dashboard/stats` | Yes | Any |
| GET | `/api/dashboard/admin` | Yes | admin |
| POST | `/api/feedback` | Yes | Any |
| GET | `/api/feedback/my` | Yes | Any |
| POST | `/api/screening/screen` | Yes | Any |
| POST | `/api/screening/skill-gap` | Yes | Any |
| GET | `/api/screening/resumes` | Yes | Any |
| GET | `/api/recruiter/dashboard` | Yes | recruiter/admin |
| GET | `/api/recruiter/candidates` | Yes | recruiter/admin |
| GET | `/api/health` | No | — |

---

*Next: See [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md) for MongoDB schema details.*
