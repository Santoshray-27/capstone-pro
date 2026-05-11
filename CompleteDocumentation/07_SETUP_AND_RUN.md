# SETUP AND RUN — Smart AI Resume Analyzer

This guide walks you through setting up the project on your local machine from scratch.

---

## ✅ Prerequisites (What You Need Installed)

| Tool | Version | Purpose | Check |
|------|---------|---------|-------|
| **Node.js** | v18+ recommended | Run the backend and frontend tools | `node --version` |
| **npm** | v9+ (comes with Node) | Install packages | `npm --version` |
| **MongoDB** | Local or Atlas | Database | See note below |
| **Git** | Any | Clone the project | `git --version` |

### MongoDB Options
- **Option A (Recommended):** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Free cloud-hosted MongoDB. Sign up, create a cluster, and get a connection string like `mongodb+srv://...`.
- **Option B:** Install MongoDB locally from [mongodb.com/try/download](https://www.mongodb.com/try/download/community). Connection string: `mongodb://localhost:27017/smart-resume-analyzer`.

---

## 📥 Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd smart-resume-analyzer
```

> If you don't have a git repo and just have the folder, skip this step.

---

## 📦 Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs all packages listed in `backend/package.json`:
- `express`, `mongoose`, `cors`, `helmet`, `morgan`, `dotenv`
- `bcryptjs`, `jsonwebtoken`, `multer`
- `pdf-parse`, `mammoth`, `node-fetch`

---

## ⚙️ Step 3: Configure Backend Environment Variables

```bash
# While in the backend/ directory
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux
```

Now open `backend/.env` in a text editor and fill in the values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB — REQUIRED
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-resume-analyzer

# JWT — REQUIRED (change to a long random string)
JWT_SECRET=my_super_secret_key_change_this_in_production_2024
JWT_EXPIRES_IN=7d

# AI API Keys — At least ONE required for AI features
GEMINI_API_KEY=AIzaSy...        # Get from: https://aistudio.google.com/
OPENAI_API_KEY=sk-...           # Optional fallback
GROQ_API_KEY=gsk_...            # Optional second fallback

# File Upload
MAX_FILE_SIZE=10485760          # 10MB in bytes
UPLOAD_DIR=uploads

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Getting a Free Gemini API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **Get API Key**
4. Copy the key and paste it as `GEMINI_API_KEY`

---

## 📦 Step 4: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs all packages listed in `frontend/package.json`:
- `react`, `react-dom`, `react-router-dom`
- `axios`, `react-hot-toast`, `recharts`, `lucide-react`
- `three`, `@react-three/fiber`, `html2pdf.js`
- Dev: `vite`, `tailwindcss`, `eslint`, `postcss`

---

## 🚀 Step 5: Run in Development Mode

Open **two terminal windows** side-by-side:

### Terminal 1 — Backend:
```bash
cd backend
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║   Smart AI Resume Analyzer Backend     ║
╠════════════════════════════════════════╣
║  Status:   ✅ Running                  ║
║  Port:     5000                        ║
║  Mode:     development                 ║
║  API:      http://localhost:5000/api   ║
╚════════════════════════════════════════╝
✅ MongoDB Connected: cluster.mongodb.net
```

### Terminal 2 — Frontend:
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Now open **http://localhost:5173** in your browser.

---

## 🔍 Step 6: Verify Everything Works

1. Open http://localhost:5173 → You should see the landing page.
2. Open http://localhost:5000/api/health → You should see:
   ```json
   {
     "status": "OK",
     "message": "Smart AI Resume Analyzer API is running",
     "environment": "development"
   }
   ```
3. Try registering an account → If MongoDB is connected, registration succeeds.
4. Try Guest Login → Works even without MongoDB (demo mode).

---

## 🏗️ Step 7: Build for Production

```bash
# Build the frontend
cd frontend
npm run build
```

This creates `frontend/dist/` — a folder of static files.

The Express backend is already configured to serve these files when `frontend/dist/` exists:

```javascript
// In server.js
if (require('fs').existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}
```

So in production, you only need to run the backend:

```bash
cd backend
npm start   # node server.js
# OR with PM2:
pm2 start ecosystem.config.cjs
```

---

## 🧪 Step 8: Running Tests

> ⚠️ **Current Status:** No automated tests are configured.

The `package.json` test script currently shows:
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

**Manual testing available:**
```bash
# Test AI service directly
cd backend
node test-ai.js
```

See [TESTING_DOCUMENTATION.md](./TESTING_DOCUMENTATION.md) for test recommendations.

---

## ❌ Common Errors and Solutions

### Error: `MongoDB connection failed`
**Cause:** MongoDB URI is wrong or MongoDB isn't running.
**Solution:**
- Check `MONGODB_URI` in `.env`
- If using Atlas, whitelist your IP address in Atlas Network Access
- If local, ensure MongoDB is running: `mongod` (or start MongoDB service)

---

### Error: `GEMINI_API_KEY not configured`
**Cause:** The `GEMINI_API_KEY` is missing or set to the placeholder value.
**Solution:** Get a real key from https://aistudio.google.com/ and update `.env`.

---

### Error: `Port 5000 already in use`
**Cause:** Another process is using port 5000.
**Solution:**
```bash
# Windows: Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <pid> /F
# OR change PORT in .env to 5001
```

---

### Error: `Module not found: Error: Can't resolve '...'`
**Cause:** `npm install` wasn't run, or a package is missing.
**Solution:**
```bash
cd frontend && npm install
cd backend && npm install
```

---

### Error: `CORS error` in browser console
**Cause:** Frontend URL doesn't match CORS config.
**Solution:** Make sure `FRONTEND_URL=http://localhost:5173` is in `backend/.env`.

---

### Error: `File type not supported`
**Cause:** User tried to upload a file that isn't PDF or DOCX.
**Solution:** Only PDF (.pdf), Word (.doc), and Word XML (.docx) are supported.

---

### Error: `Invalid file type` on upload despite valid file
**Cause:** Some PDF files report incorrect MIME types.
**Solution:** The upload middleware checks both MIME type AND file extension. Ensure file extension matches content.

---

## 📋 Summary

| Step | Command | Directory |
|------|---------|-----------|
| Install backend | `npm install` | `backend/` |
| Setup env | Copy `.env.example` → `.env`, fill values | `backend/` |
| Install frontend | `npm install` | `frontend/` |
| Run backend dev | `npm run dev` | `backend/` |
| Run frontend dev | `npm run dev` | `frontend/` |
| Build production | `npm run build` | `frontend/` |
| Start production | `npm start` | `backend/` |

---

*Next: See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed environment variable documentation.*
