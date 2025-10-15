const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const INPUT_JSON = path.join(__dirname, 'trust-center-discovery-results.json');
const OUTPUT_JSON = path.join(__dirname, 'trust-center-discovery-results.with-vendors.json');
const OUTPUT_CSV = path.join(__dirname, 'trust-center-discovery-results - trust.domains.csv');

// Known vendor CNAME suffixes
const KNOWN_VENDORS = [
  { name: 'Oneleet', suffixes: ['oneleet.com'] },
  // Add more vendors here as needed
];

function matchVendor(cname) {
  if (!cname) return null;
  const lower = cname.toLowerCase();
  for (const vendor of KNOWN_VENDORS) {
    for (const sfx of vendor.suffixes) {
      if (lower.endsWith(sfx)) {
        return vendor.name;
      }
    }
  }
  return null;
}

async function resolveCnameSafe(hostname) {
  try {
    const records = await dns.resolveCname(hostname);
    if (records && records.length > 0) {
      // Return first CNAME without trailing dot
      return records[0].replace(/\.$/, '');
    }
  } catch (_) {
    // Ignore DNS errors
  }
  return null;
}

async function main() {
  const raw = fs.readFileSync(INPUT_JSON, 'utf8');
  const data = JSON.parse(raw);

  let totalCandidates = 0;
  let flipped = 0;

  for (const result of data.results) {
    for (const tc of result.trustCenters || []) {
      if (tc.url && tc.url.startsWith('https://trust.') && tc.isTrustCenter === false) {
        totalCandidates++;
        try {
          const hostname = new URL(tc.url).hostname;
          const cname = await resolveCnameSafe(hostname);
          const vendor = matchVendor(cname);
          if (vendor) {
            tc.isTrustCenter = true; // flip to true based on vendor hosting
            tc.vendor = vendor;
            if (cname) tc.cname = cname;
            flipped++;
          } else if (cname) {
            // store cname for transparency even if no vendor match
            tc.cname = cname;
          }
        } catch (_) {
          // ignore URL parsing errors
        }
      }
    }
  }

  // Write augmented JSON
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(data, null, 2));

  // Also emit a compact CSV of trust.* domains
  const rows = ['Company,Website,TrustCenterURL,IsTrustCenter,Vendor,CNAME'];
  for (const result of data.results) {
    for (const tc of result.trustCenters || []) {
      if (tc.url && tc.url.startsWith('https://trust.')) {
        const cols = [
          result.company || '',
          result.website || '',
          tc.url || '',
          String(!!tc.isTrustCenter),
          tc.vendor || '',
          tc.cname || ''
        ];
        rows.push(cols.map(v => {
          const s = String(v);
          return s.includes(',') ? '"' + s.replace(/"/g, '""') + '"' : s;
        }).join(','));
      }
    }
  }
  fs.writeFileSync(OUTPUT_CSV, rows.join('\n'));

  console.log(`Processed trust.* candidates: ${totalCandidates}`);
  console.log(`Flipped to true via vendor detection: ${flipped}`);
  console.log(`Wrote: ${OUTPUT_JSON}`);
  console.log(`Wrote: ${OUTPUT_CSV}`);
}

if (require.main === module) {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { main };
