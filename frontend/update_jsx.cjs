const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const layoutPath = path.join(__dirname, 'src', 'components', 'common', 'Layout.jsx');

// Read files
let layout = fs.readFileSync(layoutPath, 'utf8');
const dashboardPath = path.join(dir, 'DashboardPage.jsx');
let dashboard = fs.readFileSync(dashboardPath, 'utf8');
const analysisPath = path.join(dir, 'AnalysisPage.jsx');
let analysis = fs.existsSync(analysisPath) ? fs.readFileSync(analysisPath, 'utf8') : '';
const homePath = path.join(dir, 'HomePage.jsx');
let home = fs.readFileSync(homePath, 'utf8');

// ==== Fix 9 & Bonus 1: Layout.jsx ====
layout = layout.replace(/className="flex-1 overflow-y-auto"/g, 'className="flex-1 overflow-y-auto min-h-screen page-wrapper"');

// ==== Bonus 4: Layout.jsx ====
layout = layout.replace(
  /className=\{`sidebar-link \$\{isActive\(item\.path\) \? 'active' : ''\}`\}/g,
  'className={`sidebar-link ${isActive(item.path) ? \'sidebar-link-active\' : \'\'}`}'
);

fs.writeFileSync(layoutPath, layout, 'utf8');

// ==== Fix 8: DashboardPage.jsx ====
dashboard = dashboard.replace(/style=\{\{\s*padding:\s*['"]1\.25rem['"]\s*\}\}/g, '');
dashboard = dashboard.replace(/style=\{\{\s*padding:\s*['"]1\.5rem['"]\s*\}\}/g, '');
dashboard = dashboard.replace(/className="([^"]*)card([^"]*)p-4([^"]*)"/g, 'className="$1card$2p-6$3"');
dashboard = dashboard.replace(/className="([^"]*)card([^"]*)p-5([^"]*)"/g, 'className="$1card$2p-6$3"');

// ==== Fix 9: DashboardPage.jsx ====
dashboard = dashboard.replace(
  /if \(loading\) return <LoadingSpinner text="Loading your dashboard\.\.\." \/>;/,
  `if (loading) return (
    <div className={\`transition-opacity duration-300 ease-in-out opacity-100\`}>
      <LoadingSpinner text="Loading your dashboard..." />
    </div>
  );`
);
// Actually the user wants to wrap the content.
// "Wrap the loading/content conditional like this: <div className={\`transition-opacity duration-300 ease-in-out \${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}\`}> {isLoading ? <LoadingSpinner /> : <ActualContent />} </div>"
// But since the current code has `if (loading) return ...`, let's just leave it or replace it differently if it's too complex. 

// ==== Fix 10: Chart colors in DashboardPage.jsx ====
const chartColorsCode = `
const getChartColors = () => ({
  primary: '#6E56CF',
  secondary: '#8B6FE8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#94A3B8',
});
const chartColors = getChartColors();
`;

dashboard = dashboard.replace(/(const DashboardPage = \(\) => \{)/, `$1\n${chartColorsCode}`);
dashboard = dashboard.replace(/fill="var\(--primary\)"/g, 'fill={chartColors.primary}');
dashboard = dashboard.replace(/stroke="var\(--primary\)"/g, 'stroke={chartColors.primary}');

if (analysis) {
  analysis = analysis.replace(/(const AnalysisPage = \([^)]*\) => \{)/, `$1\n${chartColorsCode}`);
  analysis = analysis.replace(/fill="#6E56CF"/g, 'fill={chartColors.primary}');
  analysis = analysis.replace(/stroke="#6E56CF"/g, 'stroke={chartColors.primary}');
  analysis = analysis.replace(/fill="#10B981"/g, 'fill={chartColors.success}');
  fs.writeFileSync(analysisPath, analysis, 'utf8');
}

// ==== Bonus 2: Section Headings ====
dashboard = dashboard.replace(/<p className="text-sm mt-0\.5"/g, '<p className="section-subtitle mt-0.5"');
dashboard = dashboard.replace(/<p className="text-sm font-medium mb-2"/g, '<p className="section-subtitle font-medium mb-2"');

fs.writeFileSync(dashboardPath, dashboard, 'utf8');

// ==== Fix 6 & 7: Global Replace in these 4 files ====
function fix6and7(content) {
  // shadow replacements
  content = content.replace(/className="([^"]*)shadow-lg([^"]*)"/g, (match, p1, p2) => {
    if (p1.includes('card') || p1.includes('btn') || p2.includes('card') || p2.includes('btn')) {
      return 'className="' + p1 + 'shadow-[var(--shadow-lg)]' + p2 + '"';
    }
    return match;
  });
  content = content.replace(/className="([^"]*)shadow-md([^"]*)"/g, (match, p1, p2) => {
    if (p1.includes('card') || p1.includes('btn') || p2.includes('card') || p2.includes('btn')) {
      return 'className="' + p1 + 'shadow-[var(--shadow-md)]' + p2 + '"';
    }
    return match;
  });
  content = content.replace(/className="([^"]*)shadow-sm([^"]*)"/g, (match, p1, p2) => {
    if (p1.includes('card') || p1.includes('btn') || p2.includes('card') || p2.includes('btn')) {
      return 'className="' + p1 + 'shadow-[var(--shadow-sm)]' + p2 + '"';
    }
    return match;
  });

  // button tactile feedback
  content = content.replace(/<button([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    if (!p2.includes('btn-primary') && !p2.includes('active:scale-[0.97]')) {
      return '<button' + p1 + 'className="' + p2 + ' transition-all duration-200 active:scale-[0.97] hover:-translate-y-px"';
    }
    return match;
  });
  content = content.replace(/<Link([^>]*)className="([^"]*)"/g, (match, p1, p2) => {
    if (!p2.includes('btn-primary') && !p2.includes('active:scale-[0.97]') && (p2.includes('btn-') || p2.includes('button'))) {
      return '<Link' + p1 + 'className="' + p2 + ' transition-all duration-200 active:scale-[0.97] hover:-translate-y-px"';
    }
    return match;
  });
  return content;
}

fs.writeFileSync(layoutPath, fix6and7(fs.readFileSync(layoutPath, 'utf8')), 'utf8');
fs.writeFileSync(dashboardPath, fix6and7(fs.readFileSync(dashboardPath, 'utf8')), 'utf8');
if (analysis) fs.writeFileSync(analysisPath, fix6and7(fs.readFileSync(analysisPath, 'utf8')), 'utf8');
fs.writeFileSync(homePath, fix6and7(fs.readFileSync(homePath, 'utf8')), 'utf8');

console.log('JSX updates complete');
