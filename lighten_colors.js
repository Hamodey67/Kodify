const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('C:\\Users\\user\\Desktop\\sys-kodify\\src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  
  // Placeholders
  content = content.replace(/slate-950/g, 'TEMP_SLATE_900');
  content = content.replace(/slate-900/g, 'TEMP_SLATE_800');
  content = content.replace(/slate-850/g, 'TEMP_SLATE_700');
  content = content.replace(/slate-800/g, 'TEMP_SLATE_700');
  
  // Replace with lighter variants
  content = content.replace(/TEMP_SLATE_900/g, 'slate-900');
  content = content.replace(/TEMP_SLATE_800/g, 'slate-800');
  content = content.replace(/TEMP_SLATE_700/g, 'slate-700');

  // Also replace slate-950 and slate-900 in index.css background variables
  if (f.endsWith('index.css')) {
    content = content.replace(/--background: 224 71% 4%;/g, '--background: 222 47% 11%;'); // slate-900
    content = content.replace(/--card: 224 71% 6%;/g, '--card: 222 47% 11%;');
    content = content.replace(/--popover: 224 71% 5%;/g, '--popover: 222 47% 11%;');
    
    // Lighten glass
    content = content.replace(/rgba\(2, 4, 10, 0\.75\)/g, 'rgba(15, 23, 42, 0.75)'); // slate-900
    content = content.replace(/rgba\(11, 15, 25, 0\.85\)/g, 'rgba(30, 41, 59, 0.85)'); // slate-800
    content = content.replace(/rgba\(2, 4, 10, 0\.95\)/g, 'rgba(15, 23, 42, 0.95)');
    content = content.replace(/rgba\(30, 58, 138, 0\.35\)/g, 'rgba(59, 130, 246, 0.35)'); // blue-500
    content = content.replace(/rgba\(30, 58, 138, 0\.25\)/g, 'rgba(59, 130, 246, 0.25)');
  }

  if (content !== original) {
    fs.writeFileSync(f, content);
  }
});
console.log("Colors brightened successfully.");
