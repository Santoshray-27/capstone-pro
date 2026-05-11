const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('c:/Users/asus/OneDrive/Desktop/Resumexpert-ai/frontend/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Regex to match <ComponentName size={xx}
  content = content.replace(/<([A-Z][a-zA-Z0-9]*|card\.icon|action\.icon|item\.icon|v\.icon|f\.icon|feature\.icon)\s+([^>]*?)size=\{?(\d+)\}?([^>]*?)>/g, (match, tagName, before, sizeStr, after) => {
    // Ignore non-lucide icons
    if (['ScoreCircle', 'Antigravity', 'LogoIcon', 'Loader', 'ResponsiveContainer', 'BarChart', 'AreaChart', 'RadarChart', 'PolarGrid'].includes(tagName)) {
      return match;
    }

    let size = parseInt(sizeStr, 10);
    
    // Sidebar, Dashboard cards, action buttons => Layout.jsx, DashboardPage.jsx
    if (file.endsWith('Layout.jsx') || file.endsWith('DashboardPage.jsx')) {
      size = 20;
    } else {
      if (size < 18) size = 18;
      if (size > 22) size = 22;
    }
    
    return `<${tagName} ${before}size={${size}}${after}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
