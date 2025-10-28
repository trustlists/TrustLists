/**
 * Create registry files for new trust centers
 */

const fs = require('fs');
const path = require('path');

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createRegistryFile(company) {
  const registryDir = path.join(__dirname, '../constants/trustCenterRegistry');
  const slug = createSlug(company.name);
  const fileName = `${slug}.js`;
  const filePath = path.join(registryDir, fileName);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`   ⚠️  ${company.name}: File already exists, skipping`);
    return { created: false, fileName };
  }
  
  const content = `export default {
  "name": "${company.name}",
  "website": "${company.website}",
  "trustCenter": "${company.trustCenter}",
  "platform": "${company.platform}",
  "iconUrl": "https://img.logo.dev/${company.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}?token=pk_X-1ZBzhHScuPdjGlT-1rrQ"
};
`;
  
  fs.writeFileSync(filePath, content);
  return { created: true, fileName };
}

async function createAllRegistryFiles() {
  console.log('🚀 Creating registry files for new trust centers...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Load new companies
  const newCompanies = JSON.parse(fs.readFileSync('new-trust-centers-to-add.json', 'utf8'));
  
  console.log(`📊 Creating ${newCompanies.length} registry files...\n`);
  
  let created = 0;
  let skipped = 0;
  
  newCompanies.forEach((company, index) => {
    const progress = ((index / newCompanies.length) * 100).toFixed(1);
    process.stdout.write(`\r📄 [${progress}%] ${index + 1}/${newCompanies.length} | ${company.name.padEnd(40).substring(0, 40)}`);
    
    const result = createRegistryFile(company);
    if (result.created) {
      created++;
    } else {
      skipped++;
    }
  });
  
  console.log('\n\n✅ Registry files created!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`   ✅ Created: ${created} files`);
  console.log(`   ⚠️  Skipped: ${skipped} files (already exist)\n`);
  
  console.log('📊 Platform Summary:');
  const platformCounts = {};
  newCompanies.forEach(c => {
    platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
  });
  Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).forEach(([platform, count]) => {
    console.log(`   ${platform.padEnd(15)} ${count.toString().padStart(3)} companies`);
  });
  console.log();
  
  return { created, skipped, total: newCompanies.length };
}

// Run if called directly
if (require.main === module) {
  createAllRegistryFiles()
    .then((result) => {
      console.log('✅ Done!');
      console.log(`\n🎯 Next steps:`);
      console.log(`   1. Run: node generate-utils.js`);
      console.log(`   2. Run: npm run generate`);
      console.log(`   3. Test the site locally\n`);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { createAllRegistryFiles };

