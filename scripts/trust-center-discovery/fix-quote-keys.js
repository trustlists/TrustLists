const fs = require('fs');
const path = require('path');

function main() {
  const dir = path.join(process.cwd(), 'constants', 'trustCenterRegistry');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  let changed = 0;

  for (const f of files) {
    const p = path.join(dir, f);
    let t = fs.readFileSync(p, 'utf8');
    const orig = t;
    // Quote known keys if unquoted at line starts inside export object
    t = t
      .replace(/(^|\n)(\s*)(name)\s*:/g, '$1$2"name":')
      .replace(/(^|\n)(\s*)(website)\s*:/g, '$1$2"website":')
      .replace(/(^|\n)(\s*)(trustCenter)\s*:/g, '$1$2"trustCenter":')
      .replace(/(^|\n)(\s*)(iconUrl)\s*:/g, '$1$2"iconUrl":')
      .replace(/(^|\n)(\s*)(platform)\s*:/g, '$1$2"platform":');

    if (t !== orig) {
      fs.writeFileSync(p, t);
      changed++;
    }
  }

  console.log(`Files updated: ${changed} of ${files.length}`);
}

if (require.main === module) main();

module.exports = { main };


