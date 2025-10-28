/**
 * Generate Auto-PR Candidates from Techstars Data
 * This script identifies companies with known trust center platforms
 */

const fs = require('fs');
const path = require('path');
const { detectPlatform } = require('./shared/detect-platforms');

async function generateAutoPRCandidates() {
  console.log('🔍 Generating auto-PR candidates from Techstars data...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Load Techstars companies
  const techstarsPath = path.join(__dirname, 'sources/techstars/companies.json');
  const companies = JSON.parse(fs.readFileSync(techstarsPath, 'utf8'));
  
  console.log(`📊 Total Techstars companies: ${companies.length}\n`);
  
  // Filter companies with trust.* subdomains
  const trustSubdomainCompanies = companies.filter(company => {
    if (!company.website) return false;
    try {
      const domain = company.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const trustUrl = `https://trust.${domain}`;
      company.trustCenterUrl = trustUrl;
      return true;
    } catch {
      return false;
    }
  });
  
  console.log(`🔍 Companies with potential trust.* subdomains: ${trustSubdomainCompanies.length}`);
  console.log(`⏱️  Detecting platforms... (this will take ~${Math.ceil(trustSubdomainCompanies.length * 3 / 60)} minutes)\n`);
  
  const autoPRCandidates = [];
  const startTime = Date.now();
  
  for (let i = 0; i < trustSubdomainCompanies.length; i++) {
    const company = trustSubdomainCompanies[i];
    const progress = ((i / trustSubdomainCompanies.length) * 100).toFixed(1);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rate = i / elapsed || 1;
    const remaining = Math.floor((trustSubdomainCompanies.length - i) / rate);
    const remainingMin = Math.floor(remaining / 60);
    
    process.stdout.write(`\r📄 [${progress}%] ${i}/${trustSubdomainCompanies.length} | ETA: ${remainingMin}m | ${company.name.padEnd(40).substring(0, 40)}`);
    
    const detection = await detectPlatform(company.trustCenterUrl);
    
    // Only include companies with known platforms (not "Unknown" or null)
    if (detection.platform && detection.platform !== 'Unknown') {
      autoPRCandidates.push({
        name: company.name,
        website: company.website,
        trustCenter: company.trustCenterUrl,
        platform: detection.platform,
        detectionMethod: detection.method,
        description: company.description || ''
      });
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n\n✅ Detection complete!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Platform breakdown
  const platformCounts = {};
  autoPRCandidates.forEach(company => {
    platformCounts[company.platform] = (platformCounts[company.platform] || 0) + 1;
  });
  
  console.log(`📈 Auto-PR Candidates: ${autoPRCandidates.length}\n`);
  console.log('Platform Breakdown:');
  console.log('─────────────────────────────────────────');
  const sorted = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([platform, count]) => {
    console.log(`   ${platform.padEnd(15)} ${count} companies`);
  });
  console.log();
  
  // Save results
  const outputPath = path.join(__dirname, 'auto-pr-candidates.json');
  fs.writeFileSync(outputPath, JSON.stringify(autoPRCandidates, null, 2));
  console.log(`💾 Saved to: auto-pr-candidates.json\n`);
  
  // Also save as CSV for easy review
  const csvPath = path.join(__dirname, 'auto-pr-candidates.csv');
  const csvHeader = 'Name,Website,Trust Center,Platform,Description\n';
  const csvRows = autoPRCandidates.map(c => 
    `"${c.name}","${c.website}","${c.trustCenter}","${c.platform}","${c.description.replace(/"/g, '""')}"`
  ).join('\n');
  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`💾 CSV saved to: auto-pr-candidates.csv\n`);
  
  return autoPRCandidates;
}

// Run if called directly
if (require.main === module) {
  generateAutoPRCandidates()
    .then(() => {
      console.log('✅ Done!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { generateAutoPRCandidates };

