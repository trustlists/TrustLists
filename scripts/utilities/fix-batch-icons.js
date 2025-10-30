#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REGISTRY_DIR = path.join(process.cwd(), 'constants', 'trustCenterRegistry');

function extract(field, content) {
  const m = content.match(new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`));
  return m ? m[1] : null;
}

function toDomain(website) {
  try { return new URL(/^https?:/.test(website) ? website : `https://${website}`).hostname.replace(/^www\./,''); } catch { return (website||'').replace(/^https?:\/\//,'').replace(/^www\./,'').split('/')[0]; }
}

function googleFavicon(domain) { return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`; }

function run() {
  const files = fs.readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.js'));
  let changed = 0;
  for (const f of files) {
    const p = path.join(REGISTRY_DIR, f);
    let content = fs.readFileSync(p, 'utf8');
    if (!content.includes('img.logo.dev')) continue;
    const website = extract('website', content);
    const domain = toDomain(website);
    if (!domain) continue;
    const newIcon = googleFavicon(domain);
    const next = content.replace(/"iconUrl"\s*:\s*"[^"]+"/, `"iconUrl": "${newIcon}"`);
    if (next !== content) {
      fs.writeFileSync(p, next);
      changed++;
      console.log(`Updated: ${f} -> ${newIcon}`);
    }
  }
  console.log(`\n✅ Updated ${changed} file(s).`);
}

if (require.main === module) run();


