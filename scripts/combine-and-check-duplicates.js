/**
 * Combine a16z and Techstars auto-PR candidates
 * Check for duplicates against existing registry
 */

const fs = require('fs');
const path = require('path');

async function combineAndCheckDuplicates() {
  console.log('🔍 Combining auto-PR candidates and checking for duplicates...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Load both datasets
  const techstars = JSON.parse(fs.readFileSync('auto-pr-candidates.json', 'utf8'));
  const a16z = JSON.parse(fs.readFileSync('sources/a16z-speedrun/auto-pr-candidates.json', 'utf8'));
  
  console.log(`📊 Loaded:`);
  console.log(`   Techstars:     ${techstars.length} candidates`);
  console.log(`   a16z Speedrun: ${a16z.length} candidates`);
  console.log(`   Total:         ${techstars.length + a16z.length} candidates\n`);
  
  // Combine datasets
  const combined = [...techstars, ...a16z];
  
  // Load existing registry
  const registryDir = path.join(__dirname, '../constants/trustCenterRegistry');
  const existingFiles = fs.readdirSync(registryDir).filter(f => f.endsWith('.js'));
  
  console.log(`📁 Existing registry: ${existingFiles.length} companies\n`);
  
  // Extract existing company names and websites
  const existingCompanies = existingFiles.map(file => {
    const content = fs.readFileSync(path.join(registryDir, file), 'utf8');
    const nameMatch = content.match(/"name":\s*"([^"]+)"/);
    const websiteMatch = content.match(/"website":\s*"([^"]+)"/);
    return {
      name: nameMatch ? nameMatch[1] : null,
      website: websiteMatch ? websiteMatch[1] : null,
      file
    };
  }).filter(c => c.name && c.website);
  
  // Normalize URLs for comparison
  const normalizeUrl = (url) => {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
  };
  
  const existingWebsites = new Set(existingCompanies.map(c => normalizeUrl(c.website)));
  const existingNames = new Set(existingCompanies.map(c => c.name.toLowerCase()));
  
  // Check for duplicates
  const duplicates = [];
  const newCompanies = [];
  
  combined.forEach(candidate => {
    const normalizedWebsite = normalizeUrl(candidate.website);
    const normalizedName = candidate.name.toLowerCase();
    
    if (existingWebsites.has(normalizedWebsite) || existingNames.has(normalizedName)) {
      duplicates.push(candidate);
    } else {
      newCompanies.push(candidate);
    }
  });
  
  console.log('🔍 Duplicate Check Results:\n');
  console.log('─────────────────────────────────────────');
  console.log(`   ✅ New companies:        ${newCompanies.length}`);
  console.log(`   ⚠️  Duplicates (skip):   ${duplicates.length}`);
  console.log(`   📊 Total candidates:     ${combined.length}\n`);
  
  if (duplicates.length > 0) {
    console.log('📋 Duplicates found (will be skipped):');
    duplicates.forEach(d => console.log(`   - ${d.name} (${d.website})`));
    console.log();
  }
  
  // Platform breakdown for new companies
  const platformCounts = {};
  newCompanies.forEach(c => {
    platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
  });
  
  console.log('📈 New Companies by Platform:\n');
  console.log('─────────────────────────────────────────');
  Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).forEach(([platform, count]) => {
    console.log(`   ${platform.padEnd(15)} ${count.toString().padStart(3)} companies`);
  });
  console.log();
  
  // Save results
  const outputPath = path.join(__dirname, 'new-trust-centers-to-add.json');
  fs.writeFileSync(outputPath, JSON.stringify(newCompanies, null, 2));
  console.log(`💾 Saved ${newCompanies.length} new companies to: new-trust-centers-to-add.json\n`);
  
  // Save CSV for review
  const csvPath = path.join(__dirname, 'new-trust-centers-to-add.csv');
  const csvHeader = 'Name,Website,Trust Center,Platform,Source\n';
  const csvRows = newCompanies.map(c => {
    const source = techstars.includes(c) ? 'Techstars' : 'a16z';
    return `"${c.name}","${c.website}","${c.trustCenter}","${c.platform}","${source}"`;
  }).join('\n');
  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`💾 CSV saved to: new-trust-centers-to-add.csv\n`);
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Ready to add ${newCompanies.length} new trust centers!`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  return newCompanies;
}

// Run if called directly
if (require.main === module) {
  combineAndCheckDuplicates()
    .then(() => {
      console.log('✅ Done!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { combineAndCheckDuplicates };

