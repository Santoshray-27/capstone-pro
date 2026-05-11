# DEPLOYMENT GUIDE — Smart AI Resume Analyzer

This guide explains how to deploy the project to production.

---

## 🏗️ Build Process Overview

```mermaid
flowchart TD
    A[Development Code] --> B[Build Frontend]
    B --> C[frontend/dist/ folder]
    C --> D[Express Backend serves dist/]
    D --> E[Deploy Backend to Railway/Render]
    E --> F[Production URL live]
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured on the hosting platform
- [ ] MongoDB Atlas cluster is set up with IP whitelist set to `0.0.0.0/0` (allow all)
- [ ] At least one AI API key (Gemini recommended) is set
- [ ] `JWT_SECRET` is a long, random, unique string
- [ ] `NODE_ENV=production` is set
- [ ] Frontend is built (`npm run build` in `frontend/`)

---

## 🌐 Option 1: Deploy Backend + Serve Frontend Together (Recommended for Simplicity)

In this approach, Express serves both the API AND the React frontend.

### Step 1: Build the Frontend

```bash
cd frontend
npm run build
# Creates frontend/dist/ directory
```

### Step 2: Set Up Environment on Hosting Platform

Set these environment variables in your hosting dashboard:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-resume-analyzer
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_real_gemini_key
OPENAI_API_KEY=your_real_openai_key
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
FRONTEND_URL=https://your-app.railway.app
```

### Step 3: Deploy to Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub repo
4. Select the repository
5. Set start command: `cd backend && npm start`
6. Add all environment variables in Railway dashboard
7. Deploy!

**Railway auto-detects** the `package.json` in backend and runs `npm start`.

---

### Step 4: Deploy to Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables
6. Deploy!

---

## 🔀 Option 2: Separate Frontend + Backend Deployment (Recommended for Scalability)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend.railway.app/api`
5. Deploy!

### Backend → Railway/Render (same as Option 1, Step 3/4)

**Important:** After frontend is deployed on Vercel, update `FRONTEND_URL` environment variable on the backend to match your Vercel URL:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## ⚙️ Production with PM2

If deploying to a VPS (DigitalOcean, AWS EC2, etc.), use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Build frontend first
cd frontend && npm run build

# Start backend with PM2
cd backend
pm2 start ecosystem.config.cjs

# Save PM2 config for auto-restart on reboot
pm2 save
pm2 startup

# Useful PM2 commands
pm2 status                          # View running processes
pm2 logs smart-resume-backend       # View logs
pm2 restart smart-resume-backend    # Restart
pm2 stop smart-resume-backend       # Stop
```

**Update `ecosystem.config.cjs`** — change `cwd` to your server path:
```javascript
cwd: '/var/www/smart-resume-analyzer/backend'
```

---

## 🗄️ MongoDB Atlas Setup

1. Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free (M0) cluster
3. **Database Access** → Add User → Set username + password
4. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere) for production
5. **Connect** → Drivers → Copy connection string
6. Replace `<password>` with your database user password

**Connection string format:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/smart-resume-analyzer?retryWrites=true&w=majority
```

---

## 🔑 AI API Keys for Production

### Gemini (Free Tier Available)
1. Go to [aistudio.google.com](https://aistudio.google.com/)
2. Sign in → Get API Key → Create API key
3. Free tier: 15 RPM (requests per minute) on gemini-2.0-flash

### OpenAI (Paid)
1. Go to [platform.openai.com](https://platform.openai.com/)
2. API → API Keys → Create new key
3. Set spending limits to control costs

### Groq (Free Tier Available)
1. Go to [console.groq.com](https://console.groq.com/)
2. Create account → API Keys → Create key
3. Free tier: generous limits on LLaMA models

---

## 🔒 Production Security Checklist

- [ ] `NODE_ENV=production` (enables security behaviors)
- [ ] `JWT_SECRET` is at least 32 random characters
- [ ] HTTPS is enabled (Railway/Render/Vercel all provide this automatically)
- [ ] MongoDB Atlas has strong database user password
- [ ] MongoDB Atlas network access reviewed (consider IP whitelist instead of `0.0.0.0/0` if possible)
- [ ] `.env` is NOT in your git repository
- [ ] Error messages don't expose sensitive internal details (production mode handles this)
- [ ] File upload directory is backed up or moved to cloud storage

---

## 🚨 Common Production Issues

### Issue: `Cannot find module` error
**Cause:** `npm install` wasn't run on the server.
**Fix:** Ensure the build/start command includes `npm install`.

### Issue: MongoDB connection fails in production
**Cause:** MongoDB Atlas IP whitelist doesn't include the server IP, or URI is wrong.
**Fix:** 
- Check Atlas Network Access → Allow `0.0.0.0/0`
- Verify `MONGODB_URI` in environment variables

### Issue: React app shows "Cannot GET /"
**Cause:** The backend is running but `frontend/dist/` was not built.
**Fix:** Run `npm run build` in the `frontend/` directory before starting the backend.

### Issue: CORS error in production
**Cause:** `FRONTEND_URL` doesn't match the actual frontend URL.
**Fix:** Set `FRONTEND_URL=https://your-actual-frontend-url.com` in backend env.

### Issue: AI features not working
**Cause:** API key missing or invalid in production environment.
**Fix:** Double-check `GEMINI_API_KEY` is set correctly in the hosting platform's env section.

### Issue: File uploads fail
**Cause:** `uploads/` directory doesn't exist on the production server.
**Fix:** The code auto-creates it via `fs.mkdirSync(uploadDir, { recursive: true })`. Ensure the process has write permissions.

---

## 📊 Hosting Platform Comparison

| Platform | Frontend | Backend | Database | Free Tier | Notes |
|----------|----------|---------|----------|-----------|-------|
| **Vercel** | ✅ Excellent | ⚠️ Serverless only | ❌ No | Yes | Best for static/serverless frontend |
| **Railway** | ✅ | ✅ Excellent | ✅ MongoDB plugin | Yes ($5 credit) | Best full-stack option |
| **Render** | ✅ | ✅ Good | ❌ No | Yes (sleeps after 15min) | Good free tier; backend sleeps on free plan |
| **DigitalOcean** | ✅ | ✅ | ✅ | No | Best for full control; requires more setup |
| **AWS** | ✅ S3+CloudFront | ✅ EC2/ECS | ✅ DocumentDB | Limited | Most powerful but most complex |

**Recommendation:** Use **Railway** for an easy, full-stack deployment with free credits, or **Vercel + Railway** for the best performance split.

---

## 📋 Deployment Summary

| Task | Command | Where |
|------|---------|-------|
| Build frontend | `npm run build` | `frontend/` |
| Start backend | `npm start` | `backend/` |
| Start with PM2 | `pm2 start ecosystem.config.cjs` | `backend/` |
| Set env vars | Platform dashboard or `.env` | Hosting platform |

---

*Next: See [IMPROVEMENTS_AND_RECOMMENDATIONS.md](./IMPROVEMENTS_AND_RECOMMENDATIONS.md) for project improvement ideas.*
