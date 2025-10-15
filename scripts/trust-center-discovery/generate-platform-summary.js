const fs = require('fs');
const path = require('path');

function main() {
  const REG = path.join(process.cwd(), 'constants', 'trustCenterRegistry');
  const files = fs.readdirSync(REG).filter((f) => f.endsWith('.js'));

  const counts = {};
  const rows = [];
  for (const f of files) {
    const t = fs.readFileSync(path.join(REG, f), 'utf8');
    const m = t.match(/"platform"\s*:\s*"([^"]+)"/);
    const n = t.match(/"name"\s*:\s*"([^"]+)"/);
    const u = t.match(/"trustCenter"\s*:\s*"([^"]+)"/);
    const platform = m ? m[1] : 'Unknown';
    counts[platform] = (counts[platform] || 0) + 1;
    rows.push({ name: n ? n[1] : f.replace(/\.js$/, ''), trustCenter: u ? u[1] : '', platform, file: f });
  }

  const outDir = path.join(process.cwd(), 'scripts', 'trust-center-discovery', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'platform-summary.json'), JSON.stringify({ counts, rows, generatedAt: new Date().toISOString() }, null, 2));

  let md = '### Trust Center Hosting Platforms (detected)\n\n| Platform | Count |\n|---|---:|\n';
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    md += `| ${k} | ${v} |\n`;
  }
  md += '\n';
  fs.writeFileSync(path.join(outDir, 'platform-summary.md'), md);

  console.log('Summary written to', path.join(outDir, 'platform-summary.json'), 'and .md');
}

if (require.main === module) main();

module.exports = { main };


