#!/usr/bin/env node
/**
 * Normalize iconUrl in registry files to Google favicon service.
 * Converts any img.logo.dev URLs to:
 *   https://www.google.com/s2/favicons?domain=<domain>&sz=128
 */
const fs = require('fs');
const path = require('path');

const REGISTRY_DIR = path.join(process.cwd(), 'constants', 'trustCenterRegistry');

function extract(field, content) {
  const m = content.match(new RegExp(`"${field}"\s*:\s*"([^"]+)"`));
  return m ? m[1] : null;
}

function toDomain(website) {
  try {
    const u = new URL(website);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return (website || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
}

function googleFavicon(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Skip if already Google favicon
  if (content.includes('www.google.com/s2/favicons')) return false;

  // Only touch if it uses img.logo.dev
  if (!content.includes('img.logo.dev')) return false;

  const website = extract('website', content);
  const domain = toDomain(website);
  if (!domain) return false;

  const newIcon = googleFavicon(domain);
  const updated = content.replace(/"iconUrl"\s*:\s*"[^"]+"/, `"iconUrl": "${newIcon}"`);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    return true;
  }
  return false;
}

function main() {
  const files = fs.readdirSync(REGISTRY_DIR).filter(f => f.endsWith('.js'));
  let changed = 0;
  files.forEach(f => {
    const filePath = path.join(REGISTRY_DIR, f);
    if (fixFile(filePath)) changed++;
  });
  console.log(`✅ Normalized icons in ${changed} file(s).`);
}

if (require.main === module) {
  main();
}

module.exports = { main };


