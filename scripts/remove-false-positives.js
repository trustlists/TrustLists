/**
 * Remove false positive trust centers
 * Only keep companies with trust.* subdomains that have verified CNAME
 */

const fs = require('fs');
const path = require('path');
const { resolveCname } = require('dns').promises;

// Known trust center hosts
const KNOWN_CNAME_HOSTS = [
  'vantatrust.com',
  'safebase.io',
  'delve.co',
  'secureframe.com',
  'secureframetrust.com',
  'drata.com',
  'conveyor.com',
  'aptible.in',
  'hypercomply.io',
  'hypercomplytrust.com',
  'oneleet.com',
  'trustarc.com',
  'onetrust.com',
  'whistic.com',
  'securitypal.com',
  'securitypalhq.com'
];

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function verifyCname(hostname) {
  try {
    const cnameRecords = await resolveCname(hostname);
    if (!cnameRecords || cnameRecords.length === 0) {
      return { hasKnownCname: false, cname: null };
    }
    
    const cname = cnameRecords[0].toLowerCase();
    const isKnown = KNOWN_CNAME_HOSTS.some(host => cname.includes(host));
    
    return { hasKnownCname: isKnown, cname };
  } catch (error) {
    return { hasKnownCname: false, cname: null };
  }
}

async function removeFalsePositives() {
  console.log('🔍 Analyzing and removing false positives...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const registryDir = path.join(__dirname, '../constants/trustCenterRegistry');
  const newCompanies = JSON.parse(fs.readFileSync('new-trust-centers-to-add.json', 'utf8'));
  
  console.log(`📊 Analyzing ${newCompanies.length} newly added companies...\n`);
  
  const toKeep = [];
  const toRemove = [];
  
  for (let i = 0; i < newCompanies.length; i++) {
    const company = newCompanies[i];
    const progress = ((i / newCompanies.length) * 100).toFixed(1);
    process.stdout.write(`\r📄 [${progress}%] ${i + 1}/${newCompanies.length} | ${company.name.padEnd(40).substring(0, 40)}`);
    
    try {
      const url = new URL(company.trustCenter);
      const hostname = url.hostname.toLowerCase();
      const pathname = url.pathname.toLowerCase();
      
      // Only keep if:
      // 1. Has trust.* subdomain
      // 2. Has CNAME pointing to known host
      
      const hasTrustSubdomain = hostname.startsWith('trust.') || 
                                hostname.startsWith('trustcenter.') ||
                                hostname.startsWith('security.') ||
                                hostname.startsWith('compliance.');
      
      if (!hasTrustSubdomain) {
        toRemove.push({ ...company, reason: 'No trust subdomain' });
        continue;
      }
      
      const { hasKnownCname, cname } = await verifyCname(hostname);
      
      if (!hasKnownCname) {
        toRemove.push({ ...company, reason: `No known CNAME (${cname || 'none'})` });
        continue;
      }
      
      toKeep.push({ ...company, cname });
      
    } catch (error) {
      toRemove.push({ ...company, reason: 'Invalid URL' });
    }
    
    // Small delay to avoid DNS rate limiting
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  console.log('\n\n✅ Analysis complete!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Keep:   ${toKeep.length} companies (verified CNAME)`);
  console.log(`   ❌ Remove: ${toRemove.length} companies (false positives)\n`);
  
  // Remove false positive files
  console.log('🗑️  Removing false positive files...\n');
  
  toRemove.forEach(company => {
    const slug = createSlug(company.name);
    const fileName = `${slug}.js`;
    const filePath = path.join(registryDir, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`   ❌ Removed: ${company.name} - ${company.reason}`);
    }
  });
  
  console.log();
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Removed ${toRemove.length} false positives!`);
  console.log(`✅ Kept ${toKeep.length} verified trust centers!`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Platform breakdown of kept companies
  console.log('📈 Verified Companies by Platform:\n');
  const platformCounts = {};
  toKeep.forEach(c => {
    platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
  });
  Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).forEach(([platform, count]) => {
    console.log(`   ${platform.padEnd(15)} ${count.toString().padStart(3)} companies`);
  });
  console.log();
  
  // Save updated list
  const outputPath = path.join(__dirname, 'verified-trust-centers.json');
  fs.writeFileSync(outputPath, JSON.stringify(toKeep, null, 2));
  console.log(`💾 Saved verified list to: verified-trust-centers.json\n`);
  
  return { toKeep, toRemove };
}

// Run if called directly
if (require.main === module) {
  removeFalsePositives()
    .then(() => {
      console.log('✅ Done! Run these commands next:');
      console.log('   1. node generate-utils.js');
      console.log('   2. npm run generate\n');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { removeFalsePositives };

