const fs = require('fs');
const path = require('path');

// This script generates a JSON file with all trust center data for API consumption
function generateTrustCentersJSON() {
  const registryDir = path.join(__dirname, 'constants/trustCenterRegistry');
  const trustCenters = [];

  try {
    const files = fs.readdirSync(registryDir);
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const filePath = path.join(registryDir, file);
        delete require.cache[require.resolve(filePath)];
        const data = require(filePath);
        const trustCenter = data.default || data;
        trustCenters.push(trustCenter);
      }
    });

    // Sort by name
    trustCenters.sort((a, b) => a.name.localeCompare(b.name));

    // Generate JSON
    const output = {
      data: trustCenters,
      meta: {
        total: trustCenters.length,
        generated: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    // Write to public directory
    const outputPath = path.join(__dirname, 'public/trust-centers.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`✅ Generated trust-centers.json with ${trustCenters.length} companies`);
  } catch (error) {
    console.error('❌ Error generating JSON:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateTrustCentersJSON();
}

module.exports = generateTrustCentersJSON;
