const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src').filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  if (content.includes('<img ') && !content.includes('import Image')) {
    content = 'import Image from "next/image";\n' + content;
    changed = true;
  }

  const oldContent = content;
  content = content.replace(/<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className="([^"]+)"\s*\/>/g, '<Image src={$1} alt={$2} fill className="$3" />');
  content = content.replace(/<img\s+src="([^"]+)"\s+alt="([^"]+)"\s+className="([^"]+)"\s*\/>/g, '<Image src="$1" alt="$2" fill className="$3" />');
  content = content.replace(/<img\s+src=\{([^}]+)\}\s+alt=\{([^}]+)\}\s+className=\{([^}]+)\}\s*\/>/g, '<Image src={$1} alt={$2} fill className={$3} />');
  
  if (oldContent !== content || changed) {
    fs.writeFileSync(f, content);
    console.log('Updated', f);
  }
});
