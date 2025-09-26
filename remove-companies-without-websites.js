const fs = require('fs');
const path = require('path');

// Companies from the CSV that don't have proper website URLs
const companiesToRemove = [
  'rippling.js',        // No website in CSV
  'clockwise.js',       // No website in CSV  
  'chartmogul.js',      // No website in CSV
  'cloudflare.js',      // No website in CSV
  'ghost.js',           // No website in CSV
  'hugging-face.js',    // No website in CSV
  'loom.js',            // No website in CSV
  'modal.js',           // No website in CSV
  'motherduck.js',      // No website in CSV
  'weights-biases.js',  // No website in CSV
  'pave.js',            // No website in CSV
  'atlassian.js',       // No website in CSV
  'pagerduty.js'        // Empty trust center in CSV
];

function removeCompaniesWithoutWebsites() {
  const registryDir = path.join(__dirname, 'constants', 'trustCenterRegistry');
  
  console.log(`🔍 Checking companies to remove (no proper website URLs):`);
  
  let removedCount = 0;
  
  companiesToRemove.forEach(filename => {
    const filePath = path.join(registryDir, filename);
    
    if (fs.existsSync(filePath)) {
      try {
        // Read the company data first
        const content = fs.readFileSync(filePath, 'utf8');
        const jsonMatch = content.match(/export default\s*({[\s\S]*?});?\s*$/);
        
        if (jsonMatch) {
          const company = JSON.parse(jsonMatch[1]);
          console.log(`❌ Removing: ${company.name} (${filename})`);
          console.log(`   Reason: No proper website URL in CSV`);
          
          // Remove the file
          fs.unlinkSync(filePath);
          removedCount++;
        }
      } catch (error) {
        console.error(`⚠️  Error processing ${filename}:`, error.message);
      }
    } else {
      console.log(`⚠️  File not found: ${filename}`);
    }
  });
  
  console.log(`\n🗑️  Removed ${removedCount} companies without proper websites`);
  console.log(`\n📊 Reasoning:`);
  console.log(`   ✅ These companies only have security pages, not trust centers`);
  console.log(`   ✅ Missing website URLs indicate incomplete data`);
  console.log(`   ✅ Maintains quality standards for TrustList`);
  
  return removedCount;
}

if (require.main === module) {
  removeCompaniesWithoutWebsites();
}

module.exports = removeCompaniesWithoutWebsites;
