# CONFIG FILES EXPLANATION — Smart AI Resume Analyzer

This document explains every configuration file in the project — what each setting does and why it is there.

---

## 📄 `backend/package.json`

```json
{
  "name": "smart-resume-analyzer-backend",
  "version": "1.0.0",
  "description": "Backend API for Smart AI Resume Analyzer",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["resume", "ai", "analyzer"],
  "author": "Smart Resume Analyzer",
  "license": "MIT",
  "dependencies": { ... },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

| Setting | Explanation |
|---------|-------------|
| `"main": "server.js"` | Entry point of the package — used if this were a library; also used by `npm start` implicitly |
| `"start": "node server.js"` | Production run command — uses raw Node.js (no auto-restart) |
| `"dev": "nodemon server.js"` | Development run command — Nodemon watches for file changes and restarts automatically |
| `"test": "echo..."` | Placeholder — no test framework configured yet |
| `"license": "MIT"` | Open source license — code is free to use and modify |

---

## 📄 `frontend/package.json`

```json
{
  "name": "smart-resume-analyzer-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 5173",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  ...
}
```

| Setting | Explanation |
|---------|-------------|
| `"private": true` | Prevents accidental `npm publish` of the frontend as a package |
| `"type": "module"` | Enables native ES Modules (`import`/`export`) in Node.js — required for Vite |
| `"dev": "vite --port 5173"` | Start Vite dev server on port 5173 explicitly |
| `"build": "vite build"` | Bundle and optimize for production → outputs to `dist/` |
| `"preview": "vite preview"` | Locally serve the production build to test before deploying |
| `"lint": "eslint . --ext js,jsx..."` | Run ESLint on all JS/JSX files; `--max-warnings 0` fails on any warning |

---

## 📄 `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

| Setting | Explanation |
|---------|-------------|
| `plugins: [react()]` | Enables React-specific Vite features: JSX transformation and Fast Refresh (HMR) |
| `server.port: 5173` | Dev server runs on this port |
| `server.proxy['/api']` | Any request starting with `/api` from the frontend is forwarded to `http://localhost:5000`. This is why you don't get CORS errors in development even though frontend (5173) and backend (5000) are on different ports |
| `changeOrigin: true` | Changes the `Host` header to match the target server (required for some backends) |
| `secure: false` | Allows proxying to HTTP (non-HTTPS) targets |
| `build.outDir: 'dist'` | Production build output folder (Express serves this in production) |
| `build.sourcemap: false` | Don't generate source maps in production (reduces bundle size; source maps can expose original code) |

---

## 📄 `frontend/tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        primary: { DEFAULT: 'var(--primary)', ... },
        // ...
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': ... }
      }
    },
  },
  plugins: [],
}
```

| Setting | Explanation |
|---------|-------------|
| `content` | Tells Tailwind which files to scan for class names. **Critical:** If a file isn't listed here, Tailwind won't include its classes in the final CSS (production builds would be missing styles) |
| `colors: { background: 'var(--background)' }` | Maps Tailwind class `bg-background` to the CSS custom property `--background` defined in `index.css`. This enables theme switching without changing Tailwind classes |
| `animation: { 'fade-in': ... }` | Registers `animate-fade-in` as a usable Tailwind class |
| `keyframes: { fadeIn, slideUp }` | Defines the actual CSS keyframe animation that `animate-fade-in` and `animate-slide-up` reference |
| `plugins: []` | No third-party Tailwind plugins needed |

**Why CSS variables for colors?** This approach lets you define the actual color values once in `index.css` and change them in one place for theming, while Tailwind class names stay the same.

---

## 📄 `frontend/postcss.config.js`

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

| Plugin | Explanation |
|--------|-------------|
| `tailwindcss` | Processes `@tailwind` directives in CSS files — generates the actual utility classes |
| `autoprefixer` | Adds vendor prefixes (`-webkit-`, `-moz-`, etc.) to CSS for cross-browser compatibility |

**Why is this needed?** Vite uses PostCSS as a CSS pipeline. Without this config, Tailwind's directives (`@tailwind base;`, etc.) in `index.css` would appear as raw text in the output CSS.

---

## 📄 `backend/.env.example`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/smart-resume-analyzer
JWT_SECRET=smart_resume_analyzer_super_secret_key_2024_production
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
FRONTEND_URL=http://localhost:5173
```

**Purpose:** A safe, committable template of all environment variables with placeholder values. New developers copy this to `.env` and fill in real values.

**Why the suffix `.example`?** Convention — `.env` is gitignored but `.env.example` is tracked. This way the team knows what variables exist without exposing real secrets.

---

## 📄 `backend/ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [{
    name: 'smart-resume-backend',
    script: 'server.js',
    cwd: '/home/user/smart-resume-analyzer/backend',
    env: { NODE_ENV: 'development', PORT: 5000 },
    watch: false,
    instances: 1,
    exec_mode: 'fork',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

| Setting | Explanation |
|---------|-------------|
| `name` | PM2 process name — used for `pm2 status`, `pm2 logs smart-resume-backend` |
| `script: 'server.js'` | Which file to run |
| `cwd` | Working directory (update this for your production server path) |
| `watch: false` | Don't auto-restart on file changes in production (avoids restart loops) |
| `instances: 1` | Run 1 process (increase for load balancing, but needs `exec_mode: 'cluster'`) |
| `exec_mode: 'fork'` | Single process mode (vs. `cluster` for multi-core) |
| `error_file` / `out_file` | Log file locations for stderr and stdout |
| `log_date_format` | Timestamp format for log entries |

**Why `.cjs` extension?** The project uses `"type": "module"` in some contexts. `.cjs` forces CommonJS interpretation — PM2 expects a CommonJS config file.

---

## 📄 `.gitignore`

```
node_modules/
.env
dist/
uploads/
*.log
```

| Entry | Why Ignored |
|-------|-------------|
| `node_modules/` | Hundreds of MB of auto-installed packages — never committed |
| `.env` | Contains real secrets — critical security |
| `dist/` | Generated production build — reproducible from source |
| `uploads/` | User files — sensitive; should be on cloud storage in production |
| `*.log` | Log files — environment-specific, potentially large |

---

## 📄 `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Smart AI Resume Analyzer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

| Element | Purpose |
|---------|---------|
| `<!doctype html>` | Declares HTML5 document type |
| `lang="en"` | Accessibility + SEO — tells browsers the page language |
| `charset="UTF-8"` | Supports all characters including special symbols |
| `viewport meta` | Makes the page responsive on mobile devices |
| `<title>` | Browser tab title + search engine result title |
| `<div id="root">` | The mounting point for React (`ReactDOM.createRoot` targets this) |
| `<script type="module">` | Loads `main.jsx` as an ES Module — required for Vite |

---

## 📋 Summary

Configuration files define how the project is built, run, and behaves in different environments:

| File | Controls |
|------|---------|
| `backend/package.json` | Scripts, dependencies, metadata |
| `frontend/package.json` | Scripts, dependencies, ESM type |
| `vite.config.js` | Build tool, dev server, API proxy |
| `tailwind.config.js` | CSS utility classes, themes, animations |
| `postcss.config.js` | CSS processing pipeline |
| `.env.example` | Environment variable template |
| `ecosystem.config.cjs` | Production process management |
| `.gitignore` | Version control exclusions |
| `index.html` | HTML entry point |

---

*Next: See [DEPENDENCY_EXPLANATION.md](./DEPENDENCY_EXPLANATION.md) for every package explained.*
