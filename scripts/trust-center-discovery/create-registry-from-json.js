const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data', 'trust-center-discovery-results.with-vendors.json');
const REGISTRY_DIR = path.join(process.cwd(), '..', '..', 'constants', 'trustCenterRegistry');

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80) || 'company';
}

function domainFromWebsite(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

function toFileContent({ name, website, trustCenter, iconUrl }) {
  // Keep formatting consistent with existing registry files
  return `export default {\n  name: "${name}",\n  website: "${website}",\n  trustCenter: "${trustCenter}",\n  iconUrl: "${iconUrl}"\n};\n`;
}

function getExistingFilenames() {
  try {
    return new Set(fs.readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.js')));
  } catch {
    return new Set();
  }
}

function extractField(content, field) {
  const regex = new RegExp(`(?:"${field}"|${field})\\s*:\\s*"([^"]+)"`);
  const m = content.match(regex);
  return m ? m[1] : null;
}

function getExistingTrustCenters() {
  const set = new Set();
  try {
    const files = fs.readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.js'));
    for (const f of files) {
      const content = fs.readFileSync(path.join(REGISTRY_DIR, f), 'utf8');
      const url = extractField(content, 'trustCenter');
      if (url) set.add(url);
    }
  } catch {}
  return set;
}

function main() {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const existing = getExistingFilenames();
  const existingTrustCenters = getExistingTrustCenters();

  const candidates = [];
  for (const r of data.results) {
    for (const tc of r.trustCenters || []) {
      if (tc.url && tc.url.startsWith('https://trust.') && tc.isTrustCenter) {
        const name = tc.companyName || r.company || '';
        const website = tc.companyWebsite || r.website || '';
        const trustCenter = tc.url;
        const domain = tc.domain || domainFromWebsite(website);
        const iconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '';
        candidates.push({ name, website, trustCenter, iconUrl });
      }
    }
  }

  // Deduplicate by trustCenter URL
  const seen = new Set();
  const uniqueCandidates = candidates.filter(c => {
    if (!c.trustCenter) return false;
    const key = c.trustCenter;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let written = 0;
  for (const c of uniqueCandidates) {
    // Skip if trustCenter already present in registry
    if (existingTrustCenters.has(c.trustCenter)) {
      continue;
    }
    if (limit && written >= limit) break;
    const base = slugify(c.name) || slugify(domainFromWebsite(c.website));
    let filename = `${base}.js`;
    let suffix = 1;
    while (existing.has(filename)) {
      // Avoid overwriting existing files; add numeric suffix
      filename = `${base}-${suffix++}.js`;
    }
    const filePath = path.join(REGISTRY_DIR, filename);
    fs.writeFileSync(filePath, toFileContent(c));
    existing.add(filename);
    existingTrustCenters.add(c.trustCenter);
    written++;
    console.log(`✅ Created ${filename}`);
  }

  console.log(`\nCreated ${written} registry files${limit ? ` (limit ${limit})` : ''}.`);
}

if (require.main === module) {
  main();
}

module.exports = { main };


