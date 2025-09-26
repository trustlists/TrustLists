const fs = require('fs');
const path = require('path');

function generateJSON() {
  const registryDir = path.join(__dirname, 'constants', 'trustCenterRegistry');
  const outputPath = path.join(__dirname, 'public', 'trust-centers.json');
  
  if (!fs.existsSync(registryDir)) {
    console.error('Registry directory not found:', registryDir);
    return;
  }

  const files = fs.readdirSync(registryDir).filter(file => file.endsWith('.js'));
  const companies = [];

  files.forEach(file => {
    try {
      const filePath = path.join(registryDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract the JSON from the export default statement
      const jsonMatch = content.match(/export default\s*({[\s\S]*?});?\s*$/);
      if (jsonMatch) {
        const company = JSON.parse(jsonMatch[1]);
        companies.push(company);
      }
    } catch (error) {
      console.error(`❌ Error loading ${file}:`, error.message);
    }
  });

  // Sort companies by name
  companies.sort((a, b) => a.name.localeCompare(b.name));

  const jsonData = {
    data: companies,
    meta: {
      total: companies.length,
      generated: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
  console.log(`✅ Generated public/trust-centers.json with ${companies.length} companies`);
}

if (require.main === module) {
  generateJSON();
}

module.exports = generateJSON;