/**
 * Full Pipeline for a16z Speedrun Companies
 * 1. Discover trust centers
 * 2. Detect platforms
 * 3. Generate auto-PR candidates
 */

const fs = require('fs');
const path = require('path');
const { discoverTrustCenters } = require('./shared/discover-trust-centers');
const { detectPlatforms } = require('./shared/detect-platforms');

async function runA16zPipeline() {
  console.log('🚀 Starting a16z Speedrun Full Pipeline...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const startTime = Date.now();
  
  // Load a16z companies
  const companiesPath = path.join(__dirname, 'sources/a16z-speedrun/companies.json');
  const companies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
  
  console.log(`📊 Total a16z companies: ${companies.length}\n`);
  
  // Step 1: Discover trust centers
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 1: Discovering Trust Centers');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const trustCentersPath = path.join(__dirname, 'sources/a16z-speedrun/trust-centers.json');
  const companiesWithTrustCenters = await discoverTrustCenters(companies, {
    outputPath: trustCentersPath,
    saveProgress: true,
    progressInterval: 25
  });
  
  // Step 2: Detect platforms
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 2: Detecting Platforms');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const platformsPath = path.join(__dirname, 'sources/a16z-speedrun/platforms.json');
  const companiesWithPlatforms = await detectPlatforms(companiesWithTrustCenters, {
    outputPath: platformsPath,
    saveProgress: true,
    progressInterval: 25
  });
  
  // Step 3: Generate auto-PR candidates
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 3: Generating Auto-PR Candidates');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const autoPRCandidates = companiesWithPlatforms.filter(c => 
    c.platform && c.platform !== 'Unknown'
  );
  
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
  
  // Save auto-PR candidates
  const autoPRPath = path.join(__dirname, 'sources/a16z-speedrun/auto-pr-candidates.json');
  const autoPRData = autoPRCandidates.map(c => ({
    name: c.name,
    website: c.website,
    trustCenter: c.trustCenterUrl,
    platform: c.platform,
    detectionMethod: c.detectionMethod,
    description: c.description || ''
  }));
  
  fs.writeFileSync(autoPRPath, JSON.stringify(autoPRData, null, 2));
  console.log(`💾 Saved to: sources/a16z-speedrun/auto-pr-candidates.json\n`);
  
  // Save CSV
  const csvPath = path.join(__dirname, 'sources/a16z-speedrun/auto-pr-candidates.csv');
  const csvHeader = 'Name,Website,Trust Center,Platform,Detection Method,Description\n';
  const csvRows = autoPRData.map(c => 
    `"${c.name}","${c.website}","${c.trustCenter}","${c.platform}","${c.detectionMethod}","${c.description.replace(/"/g, '""')}"`
  ).join('\n');
  fs.writeFileSync(csvPath, csvHeader + csvRows);
  console.log(`💾 CSV saved to: sources/a16z-speedrun/auto-pr-candidates.csv\n`);
  
  // Final summary
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ a16z Pipeline Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`⏱️  Total time: ${elapsed} minutes`);
  console.log(`📊 Total companies: ${companies.length}`);
  console.log(`🔍 With trust centers: ${companiesWithTrustCenters.filter(c => c.trustCenterUrl).length}`);
  console.log(`🎯 Auto-PR candidates: ${autoPRCandidates.length}\n`);
  
  return autoPRData;
}

// Run if called directly
if (require.main === module) {
  runA16zPipeline()
    .then(() => {
      console.log('✅ Done!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { runA16zPipeline };

