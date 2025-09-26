#!/usr/bin/env node
/**
 * Add platform hosting tags to trust center registry files
 * Usage: node scripts/add-platform-tags.js [--dry-run] [file1.js file2.js ...]
 */
const fs = require('fs');
const path = require('path');
const { lookup, resolveCname } = require('dns').promises;

const REGISTRY_DIR = path.join(process.cwd(), 'constants', 'trustCenterRegistry');

function mapPlatformFromHints({ host, cname, urlPath }) {
  const h = (host || '').toLowerCase();
  const c = (cname || '').toLowerCase();
  const p = (urlPath || '').toLowerCase();

  // Primary: explicit host patterns
  if (h.includes('safebase.io') || c.includes('safebase.io')) return 'SafeBase';
  if (h.includes('app.conveyor.com') || c.includes('aptible.in') || h.includes('conveyor.com')) return 'Conveyor';
  if (h.includes('trust.delve.co') || h === 'delve.co') return 'Delve';
  if (h.includes('trust.vanta.com') || c.includes('vantatrust.com') || h.includes('vanta.com')) return 'Vanta';
  if (h.includes('trust.drata.com') || c.includes('drata.com')) return 'Drata';
  if (h.includes('trustarc.com') || c.includes('trustarc.com')) return 'TrustArc';
  if (h.includes('onetrust.com') || c.includes('onetrust.com')) return 'OneTrust';
  if (h.includes('secureframe.com') || c.includes('secureframe.com')) return 'Secureframe';
  if (h.includes('whistic.com') || c.includes('whistic.com')) return 'Whistic';
  if (h.includes('contentsquare.com') || c.includes('contentsquare.com')) return 'Contentsquare';
  if (c.includes('cloudfront.net') && (h.startsWith('trust.') || h.includes('.trust.'))) return 'Sprinto';

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

function extractField(content, field) {
  // Match: "field": "value" or 'field': 'value'
  const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`);
  const m = content.match(regex);
  return m ? m[1] : null;
}

function getHostname(url) {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ''; }
}

function addPlatformToContent(content, platform) {
  // Check if platform field already exists
  if (content.includes('"platform"')) {
    // Update existing platform field
    return content.replace(
      /"platform"\s*:\s*"[^"]*"/,
      `"platform": "${platform}"`
    );
  } else {
    // Add platform field before iconUrl (last field)
    return content.replace(
      /"iconUrl":/,
      `"platform": "${platform}",\n  "iconUrl":`
    );
  }
}

async function processFile(filePath, dryRun = false) {
  const content = fs.readFileSync(filePath, 'utf8');
  const name = extractField(content, 'name') || path.basename(filePath, '.js');
  const trustCenter = extractField(content, 'trustCenter');
  
  if (!trustCenter) {
    console.log(`❌ ${name}: No trustCenter URL found`);
    return null;
  }

  const host = getHostname(trustCenter);
  if (!host) {
    console.log(`❌ ${name}: Invalid trustCenter URL`);
    return null;
  }

  const { cname } = await resolveInfo(host);
  const urlPath = (() => { try { return new URL(trustCenter).pathname; } catch { return ''; } })();
  const platform = mapPlatformFromHints({ host, cname, urlPath });

  console.log(`🔍 ${name}: ${platform} (${host}${cname ? ` → ${cname}` : ''})`);

  if (!dryRun) {
    const updatedContent = addPlatformToContent(content, platform);
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ ${name}: Added platform field`);
  }

  return { name, platform, host, cname, file: path.basename(filePath) };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const specifiedFiles = args.filter(arg => !arg.startsWith('--'));
  
  let files = [];
  if (specifiedFiles.length > 0) {
    // Process specified files
    files = specifiedFiles.map(f => 
      f.startsWith('/') ? f : path.join(REGISTRY_DIR, f)
    );
  } else {
    // Process all registry files
    files = fs.readdirSync(REGISTRY_DIR)
      .filter(f => f.endsWith('.js'))
      .map(f => path.join(REGISTRY_DIR, f));
  }

  console.log(`🚀 Processing ${files.length} files${dryRun ? ' (DRY RUN)' : ''}...\n`);

  const results = [];
  for (const file of files) {
    try {
      const result = await processFile(file, dryRun);
      if (result) results.push(result);
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(file)}: ${error.message}`);
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  const platformCounts = results.reduce((acc, r) => {
    acc[r.platform] = (acc[r.platform] || 0) + 1;
    return acc;
  }, {});

  for (const [platform, count] of Object.entries(platformCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${platform}: ${count}`);
  }

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to actually update files');
  } else {
    console.log('\n✅ Platform tags added! Run npm run generate to update JSON output');
  }
}

main().catch(console.error);
