# APPLICATION FLOW — ResumeXpert AI

This document explains the complete application flow from the moment a user opens the app to when they receive AI-powered career insights.

---

## 1. 🚦 Application Startup Flow

```mermaid
flowchart TD
    A[User opens browser] --> B[Vite Dev Server serves React SPA]
    B --> C[main.jsx: ReactDOM.createRoot renders App]
    C --> D[AuthProvider wraps entire app]
    D --> E{localStorage has JWT token?}
    E -- YES --> F[Call GET /api/auth/me]
    F --> G{Server validates token}
    G -- Valid --> H[Set user state → isAuthenticated = true]
    G -- Invalid/Expired --> I[Clear localStorage → isAuthenticated = false]
    E -- NO --> I
    H --> J[Route renders protected page]
    I --> K[Route redirects to /login or /home]
```

---

## 2. 🔐 Authentication Flow

### 2a. Register

```mermaid
flowchart TD
    A[User fills Register form] --> B[POST /api/auth/register]
    B --> C{Validate name, email, password}
    C -- Invalid --> D[Return 400 error]
    C -- Valid --> E{Email already exists?}
    E -- YES --> F[Return: Account already exists]
    E -- NO --> G[Create User in MongoDB]
    G --> H[bcrypt hashes password pre-save]
    H --> I[generateToken: sign JWT]
    I --> J[Return: token + user object]
    J --> K[Frontend stores token in localStorage]
    K --> L[AuthContext sets user state]
    L --> M[Redirect to /dashboard]
```

### 2b. Login

```mermaid
flowchart TD
    A[User fills Login form] --> B[POST /api/auth/login]
    B --> C[Find user by email in MongoDB]
    C --> D{User found?}
    D -- NO --> E[Return 401: Invalid credentials]
    D -- YES --> F[bcrypt.compare password]
    F --> G{Password correct?}
    G -- NO --> E
    G -- YES --> H[generateToken: sign JWT]
    H --> I[Return: token + user]
    I --> J[Frontend stores to localStorage]
    J --> K[Navigate to /dashboard]
```

### 2c. Guest Login

```mermaid
flowchart TD
    A[User clicks Try as Guest] --> B[POST /api/auth/guest-login]
    B --> C{DB connected?}
    C -- NO --> D[Return mock demo token]
    C -- YES --> E[Find or create guest_user@resumexpert.ai]
    E --> F[generateToken with guest user ID]
    F --> G[Return token + guest user]
    G --> H[Same flow as regular login]
```

---

## 3. 📤 Resume Upload Flow

```mermaid
flowchart TD
    A[User drags/selects PDF or DOCX] --> B[FormData created with file]
    B --> C[POST /api/resumes/upload multipart/form-data]
    C --> D[protect middleware: verify JWT]
    D --> E[handleResumeUpload: Multer processes file]
    E --> F{File type valid? PDF/DOCX only}
    F -- NO --> G[Return 400: Invalid file type]
    F -- YES --> H{File size < 10MB?}
    H -- NO --> I[Return 400: File too large]
    H -- YES --> J[Save file to uploads/userId/resume-timestamp.ext]
    J --> K[resumeParser.js: extractFromPDF or extractFromDOCX]
    K --> L[Extract raw text]
    L --> M[Parse: contact info, skills, experience, education, summary]
    M --> N[Create Resume document in MongoDB]
    N --> O[Update user stats: resumesUploaded + 1]
    O --> P[Return: resume object with parsedData]
    P --> Q[Frontend redirects to /analysis page]
```

---

## 4. 🧠 AI Resume Analysis Flow

```mermaid
flowchart TD
    A[User clicks Analyze on AnalysisPage] --> B[POST /api/analysis/analyze/:resumeId]
    B --> C[Fetch Resume from MongoDB by resumeId]
    C --> D[Get rawText from resume]
    D --> E[aiService.analyzeResume called]
    E --> F[Build detailed prompt with resume text + job title]
    F --> G[callAI function]
    G --> H{Try Gemini API}
    H -- Success --> I[Return gemini response text]
    H -- Fail --> J{Try OpenAI API}
    J -- Success --> K[Return openai response text]
    J -- Fail --> L{Try Groq API}
    L -- Success --> M[Return groq response text]
    L -- Fail --> N[Return null: All AI failed]
    I & K & M --> O[parseAIJson: extract JSON from response]
    O --> P{Valid JSON with atsScore?}
    P -- NO --> Q[Throw error: Invalid AI response]
    P -- YES --> R[Save Analysis to MongoDB]
    R --> S[Update Resume.atsScore + latestAnalysis ref]
    S --> T[Update User stats: analysisCount + 1]
    T --> U[Return analysis object to frontend]
    U --> V[AnalysisPage renders scores, charts, feedback]
```

---

## 5. 🎤 Interview Coach Flow

```mermaid
flowchart TD
    A[User configures interview: job title, type, count] --> B[POST /api/interviews/create]
    B --> C[aiService.generateInterviewQuestions called]
    C --> D[AI generates N questions as JSON array]
    D --> E[Save Interview document with questions to MongoDB]
    E --> F[Return interview ID + questions to frontend]
    F --> G[InterviewSessionPage loads question one by one]
    G --> H[User types answer or selects MCQ option]
    H --> I[POST /api/interviews/:id/answer]
    I --> J[aiService.evaluateInterviewAnswer called]
    J --> K[AI evaluates answer: score 0-10, feedback, model answer]
    K --> L[Update question.evaluation in Interview document]
    L --> M[Increment answeredQuestions counter]
    M --> N{All questions answered?}
    N -- NO --> O[Show next question]
    N -- YES --> P[POST /api/interviews/:id/complete]
    P --> Q[Calculate overallScore from individual scores]
    Q --> R[Update Interview status to completed]
    R --> S[Return final results + overall feedback]
    S --> T[Frontend shows final score + summary]
```

---

## 6. 🔍 Skill Gap Analysis Flow

```mermaid
flowchart TD
    A[User enters target role on SkillGapPage] --> B[POST /api/screening/skill-gap]
    B --> C[Get user's resume text from MongoDB]
    C --> D[aiService.analyzeSkillGap called]
    D --> E[AI analyzes current skills vs target role]
    E --> F[Returns: readiness %, skill categories, learning path, certifications]
    F --> G[Frontend renders radar charts + learning roadmap]
```

---

## 8. 📊 Dashboard Analytics Flow

```mermaid
flowchart TD
    A[User navigates to /dashboard] --> B[GET /api/dashboard/stats]
    B --> C[dashboard.controller aggregates data]
    C --> D[Query Resume count + average ATS score]
    C --> E[Query Analysis history - last 10]
    C --> F[Query Interview count + completion rate]
    D & E & F --> G[Return combined stats object]
    G --> H[DashboardPage renders charts with Recharts]
    H --> I[LineChart: ATS scores over time]
    H --> J[RadarChart: skill category breakdown]
    H --> K[BarChart: interview scores]
```

---

## 9. 🔒 Request Authentication Flow (Every Protected Route)

```mermaid
flowchart TD
    A[Frontend sends API request] --> B[Axios request interceptor]
    B --> C[Read token from localStorage]
    C --> D[Attach Authorization: Bearer token header]
    D --> E[Request reaches Express route]
    E --> F[protect middleware runs]
    F --> G{Token present in header?}
    G -- NO --> H[Return 401: No token]
    G -- YES --> I[jwt.verify token with JWT_SECRET]
    I --> J{Token valid?}
    J -- Expired --> K[Return 401: Token expired]
    J -- Invalid --> L[Return 401: Invalid token]
    J -- Valid --> M[Find user in MongoDB by decoded.id]
    M --> N{User exists and active?}
    N -- NO --> O[Return 401: User not found]
    N -- YES --> P[Attach req.user = user]
    P --> Q[next() → Controller runs]
```

---

## 10. 📋 Summary

The application follows a clean, predictable request cycle:

1. **Frontend** prepares data and calls `api.js` service functions.
2. **Axios interceptors** auto-attach JWT tokens.
3. **Express routes** receive requests and forward to middleware.
4. **Auth middleware** verifies JWT before any protected logic runs.
5. **Controllers** contain business logic — call models and AI services.
6. **AI Service** uses a 3-provider fallback chain for reliability.
7. **Models** persist and retrieve data from MongoDB.
8. **Error handler** catches any thrown errors and returns consistent JSON.
9. **Frontend** renders the response using React state and charts.

---

*Next: See [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture and design patterns.*
