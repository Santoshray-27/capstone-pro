# ⚛️ ResumeXpert AI - Frontend UI

The premium, high-density **Career OS** interface for ResumeXpert AI. This repository contains the modern React application that empowers job seekers through 3D visuals, interactive analytics, and a seamless AI-driven user experience.

---

## 🚀 Key Features

- **Career OS Dashboard:** High-density command center for tracking ATS scores, skill growth, and interview readiness.
- **Dynamic Resume Builder:** 6 industry-standard, ATS-optimized templates with real-time Markdown preview and pixel-perfect PDF export.
- **AI Interview Coach:** Interactive, real-time mock interview interface with AI-generated feedback and answer evaluation.
- **Premium UI/UX:** Built with a custom RGB design system, featuring **Infinite Marquee** and **Stacked Card** animations.
- **3D Intelligence Background:** A performant Three.js background that gives the platform a state-of-the-art "AI" aesthetic.

---

## 🛠️ Technology Stack

- **Framework:** React 18
- **Language:** TypeScript (Configured & Ready)
- **Build System:** Vite 5
- **Styling:** Tailwind CSS 3 (Custom RGB Design System)
- **Animations:** Framer Motion-inspired CSS & Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide-React
- **3D Graphics:** Three.js (@react-three/fiber)

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-frontend-repo-url>
   cd resumexpert-ai-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 🚀 Deployment (Vercel / Netlify)

This UI is optimized for static hosting with a decoupled backend.

### Vercel Checklist:
1. Connect your GitHub repository.
2. Ensure the **Framework Preset** is set to "Vite".
3. Add the `VITE_API_URL` environment variable pointing to your deployed backend API.
4. Deploy! Vercel will automatically run `npm run build`.

---

## 📁 Repository Structure

```
.
├── src/
│   ├── components/     # Reusable UI blocks (common, layout, dashboard)
│   ├── context/        # Global Auth & Theme state management
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Core Career OS modules (Home, Analysis, Builder)
│   ├── services/       # Axios API layer for backend communication
│   ├── App.tsx         # Main Routing and Protected Route logic
│   └── index.css       # Design tokens, fonts, and global animations
├── public/             # Static web assets (Favicon, robots.txt)
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build & proxy configuration
```

---

## 📄 License
MIT License — Designed for professional career growth.
