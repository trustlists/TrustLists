const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const withVendorsPath = path.join(baseDir, 'trust-center-discovery-results.with-vendors.json');
const readyPath = path.join(baseDir, 'trust-centers-ready-to-add.json');

function domainFromWebsite(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

function main() {
  const withVendors = JSON.parse(fs.readFileSync(withVendorsPath, 'utf8'));
  const ready = JSON.parse(fs.readFileSync(readyPath, 'utf8'));

  if (!Array.isArray(ready.highConfidence)) {
    ready.highConfidence = [];
  }

  const existing = new Set(ready.highConfidence.map(e => `${e.companyName}|${e.trustCenter}`));
  let added = 0;

  for (const r of withVendors.results) {
    for (const tc of r.trustCenters || []) {
      if (tc.url && tc.url.startsWith('https://trust.') && tc.isTrustCenter) {
        const companyName = tc.companyName || r.company || '';
        const trustCenter = tc.url;
        const website = tc.companyWebsite || r.website || '';
        const domain = tc.domain || domainFromWebsite(website);
        const key = `${companyName}|${trustCenter}`;
        if (!existing.has(key)) {
          ready.highConfidence.push({
            companyName,
            website,
            trustCenter,
            iconUrl: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : '',
            keywords: tc.keywordMatches || [],
            domain,
            ycBatch: tc.ycBatch || r.batch,
            ycStatus: tc.ycStatus || r.status,
            ycIndustry: tc.ycIndustry || r.industry,
            vendor: tc.vendor || ''
          });
          existing.add(key);
          added++;
        }
      }
    }
  }

  ready.generatedAt = new Date().toISOString();
  fs.writeFileSync(readyPath, JSON.stringify(ready, null, 2));
  console.log(`Merged vendor-confirmed entries: +${added}. Total now: ${ready.highConfidence.length}`);
}

if (require.main === module) {
  main();
}

module.exports = { main };
