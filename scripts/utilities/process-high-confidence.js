#!/usr/bin/env node
/**
 * Process high confidence trust centers and create registry files
 * Used by GitHub Actions workflow
 */
const fs = require('fs');
const path = require('path');

function main() {
  try {
    // Read the high confidence results
    const resultsPath = 'scripts/trust-center-discovery/trust-centers-ready-to-add.json';
    
    if (!fs.existsSync(resultsPath)) {
      console.log('No high confidence results file found');
      process.exit(0);
    }
    
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    
    if (!results.highConfidence || results.highConfidence.length === 0) {
      console.log('No high confidence results to process');
      process.exit(0);
    }
    
    console.log(`Processing ${results.highConfidence.length} high confidence trust centers...`);
    
    // Create registry files for each high confidence result
    results.highConfidence.forEach((tc, index) => {
      const fileName = tc.companyName.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '.js';
      
      const registryContent = `module.exports = {
  "name": "${tc.companyName}",
  "website": "${tc.companyWebsite}",
  "trustCenter": "${tc.trustCenter}",
  "iconUrl": "${tc.iconUrl}"
};`;
      
      const filePath = path.join('constants', 'trustCenterRegistry', fileName);
      fs.writeFileSync(filePath, registryContent);
      console.log(`Created: ${filePath}`);
    });
    
    console.log(`Created ${results.highConfidence.length} registry files`);
    
  } catch (error) {
    console.error('Error processing high confidence results:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
