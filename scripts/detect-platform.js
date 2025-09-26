#!/usr/bin/env node
/**
 * Detect hosting platform for trust centers by DNS and URL patterns.
 * - Reads all files in constants/trustCenterRegistry/
 * - Extracts trustCenter URL with a simple regex
 * - Resolves CNAME/A records and maps hostnames to friendly platform names
 * - Prints a Markdown summary to stdout
 */
const fs = require('fs');
const path = require('path');
const { lookup, resolveCname } = require('dns').promises;

const REGISTRY_DIR = path.join(process.cwd(), 'constants', 'trustCenterRegistry');

function listRegistryFiles() {
  try {
    return fs
      .readdirSync(REGISTRY_DIR)
      .filter((f) => f.endsWith('.js'))
      .map((f) => path.join(REGISTRY_DIR, f));
  } catch (e) {
    return [];
  }
}

function extractField(content, field) {
  const regex = new RegExp(`"${field}"\s*:\s*"([^"]+)"`);
  const m = content.match(regex);
  return m ? m[1] : null;
}

function getHostname(url) {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

function mapPlatformFromHints({ host, cname, urlPath }) {
  const h = (host || '').toLowerCase();
  const c = (cname || '').toLowerCase();
  const p = (urlPath || '').toLowerCase();

  // Primary: explicit host patterns
  if (h.includes('safebase.io') || c.includes('safebase.io')) return 'SafeBase';
  if (h.includes('app.conveyor.com') || c.includes('aptible.in') || h.includes('conveyor.com')) return 'Conveyor';
  if (h.includes('trust.delve.co') || h === 'delve.co' || p.startsWith('/')) return 'Delve';
  if (h.includes('trust.vanta.com') || c.includes('vantatrust.com') || h.includes('vanta.com')) return 'Vanta';
  if (h.includes('trust.drata.com') || h.includes('drata.com')) return 'Drata';
  if (h.includes('trustarc.com') || c.includes('trustarc.com')) return 'TrustArc';
  if (h.includes('onetrust.com') || c.includes('onetrust.com')) return 'OneTrust';
  if (h.includes('secureframe.com') || c.includes('secureframe.com')) return 'Secureframe';
  if (h.includes('whistic.com') || c.includes('whistic.com')) return 'Whistic';
  if (h.includes('contentsquare.com') || c.includes('contentsquare.com')) return 'Contentsquare';

  // Heuristic: common subdomains
  if (h.startsWith('trust.') || h.includes('.trust.')) return 'Self-hosted';
  if (h.startsWith('security.') || h.includes('.security.')) return 'Self-hosted';
  return 'Other';
}

async function resolveInfo(host) {
  let cname = null;
  try {
    const res = await resolveCname(host);
    if (res && res.length) cname = res[0];
  } catch {}
  let ip = null;
  try {
    const { address } = await lookup(host);
    ip = address || null;
  } catch {}
  return { cname, ip };
}

async function main() {
  const files = process.argv.slice(2).length ? process.argv.slice(2) : listRegistryFiles();
  const rows = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const name = extractField(content, 'name') || path.basename(file, '.js');
    const trustCenter = extractField(content, 'trustCenter');
    if (!trustCenter) continue;
    const host = getHostname(trustCenter);
    const { cname, ip } = await resolveInfo(host);
    const urlPath = (() => { try { return new URL(trustCenter).pathname; } catch { return ''; } })();
    const platform = mapPlatformFromHints({ host, cname, urlPath });
    rows.push({ name, trustCenter, host, cname, ip, platform, file: path.basename(file) });
  }

  // Group counts
  const counts = rows.reduce((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + 1;
    return acc;
  }, {});

  // Markdown summary
  let md = '### Trust Center Hosting Platforms (detected)\n\n';
  md += '| Platform | Count | Examples |\n|---|---:|---|\n';
  const order = ['SafeBase','Conveyor','Delve','Vanta','Drata','TrustArc','OneTrust','Secureframe','Whistic','Contentsquare','Self-hosted','Other'];
  for (const key of order) {
    const list = rows.filter(r => r.platform === key);
    if (!list.length) continue;
    const examples = list.slice(0,3).map(r => `${r.name}`).join(', ');
    md += `| ${key} | ${list.length} | ${examples} |\n`;
  }
  md += '\n<details><summary>Details</summary>\n\n';
  md += '| Company | Platform | Host | CNAME | File |\n|---|---|---|---|---|\n';
  for (const r of rows) {
    md += `| ${r.name} | ${r.platform} | ${r.host} | ${r.cname || ''} | ${r.file} |\n`;
  }
  md += '\n</details>\n';

  console.log(md);

  // Also emit a machine-readable JSON if needed by callers
  if (process.env.OUTPUT_JSON_PATH) {
    fs.writeFileSync(process.env.OUTPUT_JSON_PATH, JSON.stringify({ rows, counts }, null, 2));
  }
}

main().catch((e) => {
  console.error('Detection failed:', e);
  process.exit(1);
});


