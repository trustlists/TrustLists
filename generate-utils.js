const fs = require('fs');
const path = require('path');

function generateUtils() {
  const registryDir = path.join(__dirname, 'constants', 'trustCenterRegistry');
  const utilsPath = path.join(__dirname, 'utils', 'trustCenters.js');
  
  if (!fs.existsSync(registryDir)) {
    console.error('Registry directory not found:', registryDir);
    return;
  }

  const files = fs.readdirSync(registryDir).filter(file => file.endsWith('.js'));
  console.log(`Found ${files.length} company files`);

  // Generate imports with proper variable names
  const imports = files.map(file => {
    const baseName = path.basename(file, '.js');
    // Handle filenames that start with numbers or special chars
    let varName = baseName.replace(/[^a-zA-Z0-9]/g, '');
    if (/^\d/.test(varName)) {
      varName = '_' + varName;
    }
    if (varName === '') {
      varName = 'company' + Math.random().toString(36).substr(2, 5);
    }
    return {
      varName,
      import: `import ${varName} from '../constants/trustCenterRegistry/${file}';`
    };
  }).sort((a, b) => a.varName.localeCompare(b.varName));

  const utilsContent = `// Auto-generated imports - DO NOT EDIT MANUALLY
// This file is automatically updated by generate-utils.js
${imports.map(imp => imp.import).join('\n')}

const trustCenterData = [
  ${imports.map(imp => imp.varName).join(',\n  ')}
];

export function getAllTrustCenters() {
  // Sort by name
  return trustCenterData.sort((a, b) => a.name.localeCompare(b.name));
}

export function getTrustCenterByName(name) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.find(tc => tc.name === name);
}

export function searchTrustCenters(query) {
  let trustCenters = getAllTrustCenters();

  // Apply search query
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    trustCenters = trustCenters.filter(tc =>
      tc.name.toLowerCase().includes(searchTerm) ||
      tc.description.toLowerCase().includes(searchTerm)
    );
  }

  return trustCenters;
}

export function getStats() {
  const trustCenters = getAllTrustCenters();

  return {
    totalCompanies: trustCenters.length
  };
}
`;

  fs.writeFileSync(utilsPath, utilsContent);
  console.log(`✅ Generated utils/trustCenters.js with ${imports.length} companies`);
}

if (require.main === module) {
  generateUtils();
}

module.exports = generateUtils;