# DEPENDENCY EXPLANATION — Smart AI Resume Analyzer

This document explains every dependency and devDependency in both `backend/package.json` and `frontend/package.json`.

---

## ⚙️ Backend Dependencies (`backend/package.json`)

### Production Dependencies

| Package | Version | What it is | Why it's needed | Where used |
|---------|---------|------------|----------------|------------|
| `express` | `^4.18.2` | Web framework for Node.js | Core framework — handles HTTP routing, middleware, request/response | `server.js`, all route files |
| `mongoose` | `^8.0.3` | MongoDB ODM (Object Document Mapper) | Provides schema validation, query API, and middleware for MongoDB | All `models/*.model.js`, `config/database.js` |
| `cors` | `^2.8.5` | CORS middleware for Express | Allows browser on port 5173 to make requests to backend on port 5000 | `server.js` |
| `helmet` | `^7.1.0` | HTTP security headers middleware | Sets headers like CSP, X-Frame-Options to prevent common web attacks | `server.js` |
| `morgan` | `^1.10.0` | HTTP request logger | Logs every incoming request in dev: `GET /api/auth/me 200 25ms` | `server.js` (dev only) |
| `dotenv` | `^16.3.1` | .env file loader | Loads environment variables from `.env` into `process.env` | `server.js` (first line) |
| `jsonwebtoken` | `^9.0.2` | JWT creation and verification | Creates signed tokens on login; verifies them on each protected request | `utils/generateToken.js`, `middleware/auth.middleware.js` |
| `bcryptjs` | `^2.4.3` | Password hashing library | Hashes passwords before storage; compares plain text vs hash on login | `models/User.model.js`, `controllers/auth.controller.js` |
| `multer` | `^1.4.5-lts.1` | Multipart form-data handler | Handles file upload from browser; saves to disk with configurable limits | `middleware/upload.middleware.js` |
| `pdf-parse` | `^1.1.1` | PDF text extractor | Reads PDF files and extracts plain text content | `utils/resumeParser.js` → `extractFromPDF()` |
| `mammoth` | `^1.6.0` | DOCX text extractor | Reads Microsoft Word (.docx) files and extracts plain text | `utils/resumeParser.js` → `extractFromDOCX()` |
| `node-fetch` | `^2.7.0` | HTTP client for Node.js | Makes HTTP requests to Gemini/OpenAI/Groq APIs from the backend | `utils/aiService.js` |

### DevDependencies (Backend)

| Package | Version | What it is | Why it's needed |
|---------|---------|------------|----------------|
| `nodemon` | `^3.0.2` | Auto-restart tool | Watches for file changes in `backend/` and restarts `server.js` automatically during development. Without it, you'd need to manually restart after every code change. |

---

## 🖥️ Frontend Dependencies (`frontend/package.json`)

### Production Dependencies

| Package | Version | What it is | Why it's needed | Where used |
|---------|---------|------------|----------------|------------|
| `react` | `^18.2.0` | UI library | Core framework for building the SPA with components, state, and hooks | All `.jsx` files |
| `react-dom` | `^18.2.0` | DOM renderer for React | Renders React components to the browser DOM | `main.jsx` |
| `react-router-dom` | `^6.21.3` | Client-side routing | Handles navigation between pages without full page reloads | `App.jsx` |
| `axios` | `^1.6.5` | HTTP client | Makes API calls to the backend with auto-token attachment | `services/api.js` |
| `react-hot-toast` | `^2.4.1` | Toast notifications | Shows success/error/loading pop-up messages | `App.jsx` (global), all pages |
| `recharts` | `^2.10.3` | Chart library for React | Renders interactive charts (line, radar, bar) on Dashboard and Analysis pages | `DashboardPage.jsx`, `AnalysisPage.jsx` |
| `lucide-react` | `^0.309.0` | Icon library | Provides clean SVG icons as React components | All pages and layout |
| `three` | `^0.184.0` | 3D graphics library | Powers the animated 3D background using WebGL | `GlobalBackground.jsx` |
| `@react-three/fiber` | `^8.18.0` | React renderer for Three.js | Lets you write Three.js scenes using JSX/React syntax | `GlobalBackground.jsx` |
| `html2pdf.js` | `^0.10.1` | Client-side PDF generator | Converts the resume builder's HTML preview to a downloadable PDF | `ResumeBuilderPage.jsx` |

### DevDependencies (Frontend)

| Package | Version | What it is | Why it's needed |
|---------|---------|------------|----------------|
| `vite` | `^5.0.11` | Build tool and dev server | Ultra-fast bundling and HMR (Hot Module Replacement) for development |
| `@vitejs/plugin-react` | `^4.2.1` | React plugin for Vite | Enables React JSX transformation and Fast Refresh in Vite |
| `tailwindcss` | `^3.4.1` | CSS utility framework | Generates all `bg-`, `text-`, `flex` etc. utility classes from config |
| `postcss` | `^8.4.33` | CSS preprocessor | Required pipeline for Tailwind and Autoprefixer to process CSS |
| `autoprefixer` | `^10.4.16` | CSS vendor prefix adder | Adds `-webkit-`, `-moz-` prefixes for cross-browser CSS compatibility |
| `eslint` | `^8.55.0` | JavaScript linter | Catches code errors, enforces style rules |
| `eslint-plugin-react` | `^7.33.2` | React ESLint rules | Adds React-specific linting rules (e.g., missing key props) |
| `eslint-plugin-react-hooks` | `^4.6.0` | Hooks ESLint rules | Enforces Rules of Hooks (e.g., don't call hooks conditionally) |
| `eslint-plugin-react-refresh` | `^0.4.5` | Vite HMR lint rules | Warns when components won't hot-reload correctly |
| `@types/react` | `^18.2.43` | TypeScript types for React | Provides IDE type hints and autocomplete for React APIs (useful even in JS projects) |
| `@types/react-dom` | `^18.2.17` | TypeScript types for React DOM | Same — IDE support for React DOM APIs |

---

## 🔍 Dependency Decisions Explained

### Why `node-fetch` v2 instead of v3?

`node-fetch` v3+ is ESM-only (no CommonJS support). The backend uses CommonJS (`require()`), so v2 is used for compatibility. If the backend migrated to ESM (`"type": "module"` in package.json), v3 could be used.

### Why `mammoth` instead of `docx` package?

`mammoth` is specifically designed for text extraction (converting DOCX → plain text). The `docx` package is designed for creating DOCX files. Since we only need to read text, `mammoth` is the right choice.

### Why `bcryptjs` instead of `bcrypt`?

`bcrypt` requires native Node.js bindings (compiled C code), which can fail during `npm install` on some systems. `bcryptjs` is a pure JavaScript implementation that works everywhere, with comparable security.

### Why `pdf-parse` instead of alternatives?

`pdf-parse` is battle-tested, widely used, and handles most PDF formats including complex ones. Alternatives like `pdfjs-dist` are larger and designed for browser use.

### Why `recharts` instead of Chart.js?

`recharts` is built specifically for React and uses a declarative JSX API:
```jsx
<LineChart data={data}>
  <Line type="monotone" dataKey="score" stroke="#8884d8" />
</LineChart>
```
Chart.js requires imperative DOM manipulation which doesn't fit React's model well.

### Why `@react-three/fiber` alongside `three`?

`three` is the core 3D library. `@react-three/fiber` (R3F) is a React-specific adapter that lets you write Three.js scenes as JSX components. Without R3F, you'd have to manually manage Three.js lifecycle in `useEffect` hooks — much more complex.

---

## ⚠️ Potentially Unused Dependencies

| Package | Notes |
|---------|-------|
| `@react-three/fiber` + `three` | Used only in `GlobalBackground.jsx`. If the 3D background is removed, these (~1.5MB) can be uninstalled |
| `@types/react` + `@types/react-dom` | Useful for IDE hints. Technically not required in a pure JS project, but harmless |
| `html2pdf.js` | Only used in `ResumeBuilderPage.jsx`. If PDF export feature is removed, this (~300KB) can be uninstalled |

---

## 📦 Package Size Awareness

| Package | Approximate Size | Notes |
|---------|-----------------|-------|
| `three` | ~600KB gzipped | Large; consider lazy loading if initial load time is a concern |
| `recharts` | ~300KB | Includes D3.js internals |
| `html2pdf.js` | ~300KB | Includes jsPDF and html2canvas |
| `lucide-react` | Treeshakeable | Only the icons you import are bundled |
| `react` + `react-dom` | ~130KB | Core React runtime |
| `axios` | ~13KB | Small and efficient |

---

## 📋 Summary

| Side | Production Deps | Dev Deps | Total |
|------|---------------|---------|-------|
| Backend | 11 | 1 | 12 |
| Frontend | 10 | 11 | 21 |

All dependencies serve a specific purpose. No major redundancies were found. The largest potential optimization would be lazy-loading `three.js` for the 3D background or removing it if performance is a concern.

---

*Next: See [SECURITY.md](./SECURITY.md) for security implementation details.*
