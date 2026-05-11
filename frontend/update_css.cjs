const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Fix 6: Add shadow tokens
if (!css.includes('--shadow-colored')) {
  css = css.replace(
    /  --spacing: 0.25rem;\n}/g,
    `  --spacing: 0.25rem;
  --shadow-sm: 0 1px 3px rgba(110, 86, 207, 0.06);
  --shadow-md: 0 4px 16px rgba(110, 86, 207, 0.10);
  --shadow-lg: 0 8px 32px rgba(110, 86, 207, 0.14);
  --shadow-colored: 0 4px 20px rgba(110, 86, 207, 0.22);
}`
  );
}

// Fix 6: Update .card and .card-hover
css = css.replace(/\.card \{[^}]+\}/g, `.card {
  background: var(--card);
  color: var(--card-foreground);
  border-radius: 16px;
  border: 1px solid var(--border);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}`);

css = css.replace(/\.card-hover:hover \{[^}]+\}/g, `.card-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}`);


// Fix 7: Update .btn-primary and .btn-secondary
css = css.replace(/\.btn-primary \{[^}]+\}/g, `.btn-primary {
  font-weight: 500;
  padding: 0.5rem 1.25rem;
  border-radius: 10px;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-colored);
  background: var(--primary);
  color: var(--primary-foreground);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}`);

css = css.replace(/\.btn-secondary \{[^}]+\}/g, `.btn-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);
  @apply font-medium py-2 px-5 rounded-lg border border-border;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}`);

if (!css.includes('.btn-primary:hover')) {
  css = css.replace('.btn-secondary {', `.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(110, 86, 207, 0.30);
  filter: brightness(1.05);
}

.btn-primary:active {
  transform: scale(0.97) translateY(0px);
  box-shadow: var(--shadow-sm);
  filter: brightness(0.97);
}

.btn-secondary {`);
}

if (!css.includes('.btn-secondary:hover')) {
  css = css.replace('.btn-outline {', `.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary:active {
  transform: scale(0.97);
}

.btn-outline {`);
}

// Fix 9: Add skeleton
css = css.replace(/\.skeleton \{[^}]+\}/g, `.skeleton {
  background: linear-gradient(90deg, #f0eeff 25%, #e8e4ff 50%, #f0eeff 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 10px;
}`);

// Bonus 1 & 2
if (!css.includes('.page-wrapper')) {
  css = css.replace('/* ===================== TYPOGRAPHY UTILITIES ===================== */', `/* ===================== TYPOGRAPHY UTILITIES ===================== */
@layer utilities {
  .page-wrapper {
    background: linear-gradient(160deg, #fdfcff 0%, #f4f2ff 50%, #eef2ff 100%);
    min-height: 100vh;
  }`);
}

css = css.replace(/\.section-title \{[^}]+\}/g, `.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.01em;
  line-height: 1.3;
}`);

if (!css.includes('.section-subtitle')) {
  css = css.replace('.section-title {', `.section-subtitle {
  font-size: 0.85rem;
  color: #5A6380;
  margin-top: 2px;
}
  .section-title {`);
}

// Bonus 3: Custom scrollbar
css = css.replace(/\/\* ===================== SCROLLBAR ===================== \*\/[\s\S]*?\/\* ===================== BUTTON PRESS ===================== \*\//, `/* ===================== SCROLLBAR ===================== */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(110, 86, 207, 0.25);
  border-radius: 99px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(110, 86, 207, 0.55);
}

/* ===================== BUTTON PRESS ===================== */`);

// Bonus 4: Active sidebar item
if (!css.includes('.sidebar-link-active')) {
  css += `\n\n.sidebar-link-active {
  background: linear-gradient(90deg, rgba(110,86,207,0.13) 0%, rgba(110,86,207,0.04) 100%);
  border-left: 3px solid var(--primary);
  border-radius: 0 10px 10px 0;
  color: var(--primary) !important;
  font-weight: 600;
  padding-left: calc(1rem - 3px);
}\n`;
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('index.css updated');
