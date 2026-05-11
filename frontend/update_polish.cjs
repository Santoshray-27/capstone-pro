const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const layoutPath = path.join(__dirname, 'src', 'components', 'common', 'Layout.jsx');
const indexCssPath = path.join(__dirname, 'src', 'index.css');

// Read files
let layout = fs.readFileSync(layoutPath, 'utf8');
const dashboardPath = path.join(dir, 'DashboardPage.jsx');
let dashboard = fs.readFileSync(dashboardPath, 'utf8');
const homePath = path.join(dir, 'HomePage.jsx');
let home = fs.readFileSync(homePath, 'utf8');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

// ==== POLISH 1: HomePage.jsx Hero Glow ====
home = home.replace(
  /<div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">/g,
  `<div className="relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--primary)] opacity-[0.07] blur-[80px] rounded-full pointer-events-none z-0" />
          <div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">`
);
home = home.replace(
  /<\/div>\s*<\!-- Mock UI Preview -->/,
  `</div>
        </div>
        {/* Mock UI Preview */}`
);
// Make sure it wraps correctly. Wait, actually I will just replace the exact match for `<div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">` and then find the corresponding closing div. This might be tricky. Let me do a safer replace.

home = home.replace(
  /<div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">([\s\S]*?)<\/div>\s*<\!-- Mock UI Preview -->/g,
  `<div className="relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--primary)] opacity-[0.07] blur-[80px] rounded-full pointer-events-none z-0" />
          <div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">$1</div>
        </div>
        {/* Mock UI Preview */}`
);

// If the regex above fails, we'll try a simpler replace
if (!home.includes('<div className="relative">\n          <div className="absolute -top-20 left-1/2')) {
  home = home.replace(
    '<div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">',
    `<div className="relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[var(--primary)] opacity-[0.07] blur-[80px] rounded-full pointer-events-none z-0" />
          <div className="max-w-5xl mx-auto text-center relative z-10 stagger-children">`
  );
  home = home.replace(
    '          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium text-[var(--muted-foreground)]">\n            <span className="flex items-center gap-1.5"><CheckCircle size={18} className="text-emerald-500" /> No Credit Card</span>\n            <span className="flex items-center gap-1.5"><CheckCircle size={18} className="text-emerald-500" /> Free Analysis</span>\n            <span className="flex items-center gap-1.5"><CheckCircle size={18} className="text-emerald-500" /> ATS Optimized</span>\n          </div>\n        </div>',
    '          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-medium text-[var(--muted-foreground)]">\n            <span className="flex items-center gap-1.5"><CheckCircle size={18} className="text-emerald-500" /> No Credit Card</span>\n            <span className="flex items-center gap-1.5"><CheckCircle size={18} className="text-emerald-500" /> Free Analysis</span>\n            <span className="flex items-center gap-1.5"><CheckCircle size={18} className="text-emerald-500" /> ATS Optimized</span>\n          </div>\n        </div>\n        </div>'
  );
}


// ==== POLISH 2: DashboardPage.jsx Stat Cards ====
dashboard = dashboard.replace(
  /<div className="flex items-start justify-between mb-4">/g,
  `<div className="h-1 w-12 rounded-full mb-4" style={{ background: 'var(--primary)', opacity: 0.7 }} />
              <div className="flex items-start justify-between mb-4">`
);

dashboard = dashboard.replace(
  /<span className="text-3xl font-bold" style={{ color: 'var\(--foreground\)', letterSpacing: '-0\.03em' }}>/g,
  `<span className="text-3xl font-black tracking-tight" style={{ color: 'var(--primary)', letterSpacing: '-0.03em' }}>`
);

// ==== POLISH 3: Layout.jsx Navbar ====
layout = layout.replace(
  /<header\s*className="h-14 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50"[\s\S]*?>/,
  `<header
          className="h-14 px-6 flex items-center justify-between shrink-0 sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_1px_0_rgba(110,86,207,0.08)]"
        >`
);

// ==== POLISH 4: Layout.jsx Sidebar Logo ====
layout = layout.replace(
  /<div className="px-5 py-6" style={{ borderBottom: '1px solid var\(--sidebar-border\)' }}>/,
  `<div className="px-5 py-6 bg-gradient-to-r from-[rgba(110,86,207,0.06)] to-transparent" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>`
);

// ==== POLISH 5: DashboardPage.jsx Action Buttons ====
dashboard = dashboard.replace(
  /className="flex items-center gap-3 px-3 py-2\.5 rounded-xl transition-colors group"/g,
  `className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group relative overflow-hidden"`
);

dashboard = dashboard.replace(
  /<div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"/g,
  `<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"`
);


// ==== POLISH 6: Badge & Tag Styling ====
const newBadges = `  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.65rem;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid transparent;
  }
  .badge-primary {
    background: rgba(110, 86, 207, 0.1);
    color: var(--primary);
    border-color: rgba(110, 86, 207, 0.2);
  }
  .badge-success {
    background: rgba(16, 185, 129, 0.1);
    color: #059669;
    border-color: rgba(16, 185, 129, 0.2);
  }
  .badge-warning {
    background: rgba(245, 158, 11, 0.1);
    color: #D97706;
    border-color: rgba(245, 158, 11, 0.2);
  }
  .badge-danger {
    background: rgba(239, 68, 68, 0.1);
    color: #DC2626;
    border-color: rgba(239, 68, 68, 0.2);
  }`;

indexCss = indexCss.replace(/\.badge \{[\s\S]*?\.badge-secondary \{[^}]+\}/, newBadges);
dashboard = dashboard.replace(/badge-secondary/g, 'badge-primary');

// ==== POLISH 7: Smooth Page Entrance Animation ====
const newPageEnter = `.page-enter {
  animation: pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`;
indexCss = indexCss.replace(/\.page-enter \{[\s\S]*?\}\s*@keyframes page-enter \{[\s\S]*?\}/, newPageEnter);
indexCss = indexCss.replace(/@keyframes page-enter \{[\s\S]*?\}\s*/, '');
indexCss = indexCss.replace(/\.animate-page-enter \{[^}]+\}/, '.animate-page-enter { animation: pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }');

dashboard = dashboard.replace(/<div className="space-y-6 stagger-children">/, '<div className="space-y-6 stagger-children page-enter">');
home = home.replace(/<div className="min-h-screen bg-\[var\(--background\)\] selection:bg-\[var\(--primary\)\] selection:text-white">/, '<div className="min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white page-enter">');

// ==== POLISH 8: Footer Gradient ====
home = home.replace(
  /<footer className="bg-white border-t border-\[var\(--border\)\] pt-20 pb-10 px-4">/,
  `<footer className="border-t border-[var(--border)] pt-20 pb-10 px-4 bg-gradient-to-b from-transparent to-[#f4f2ff] text-[#5A6380]">`
);

// Save everything
fs.writeFileSync(homePath, home, 'utf8');
fs.writeFileSync(dashboardPath, dashboard, 'utf8');
fs.writeFileSync(layoutPath, layout, 'utf8');
fs.writeFileSync(indexCssPath, indexCss, 'utf8');

console.log('Polish complete');
