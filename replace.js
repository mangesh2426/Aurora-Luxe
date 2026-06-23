const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
let fileCount = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;
  
  // Replace ${something.toLocaleString()} with ₹{something.toLocaleString()}
  content = content.replace(/\$\{([^}]+?\.toLocaleString\(\))\}/g, '₹{$1}');
  
  // Look for ${shipping} or ${total} if they are preceded by >$ or > $
  // actually wait, let's just do >$ and > $
  content = content.replace(/>\$/g, '>₹');
  content = content.replace(/> \$/g, '> ₹');
  
  // Replace "$50" or '-$50'
  content = content.replace(/-\$/g, '-₹');
  content = content.replace(/"\$/g, '"₹');

  if (content !== originalContent) {
    fs.writeFileSync(f, content, 'utf8');
    fileCount++;
    console.log(`Replaced in ${f}`);
  }
});

console.log(`Updated ${fileCount} files.`);
