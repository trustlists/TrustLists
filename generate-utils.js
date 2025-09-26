const fs = require('fs');
const path = require('path');

// This script auto-generates the utils/trustCenters.js file with all imports
function generateUtilsFile() {
  const registryDir = path.join(__dirname, 'constants/trustCenterRegistry');
  const utilsPath = path.join(__dirname, 'utils/trustCenters.js');
  
  try {
    const files = fs.readdirSync(registryDir);
    const jsFiles = files.filter(file => file.endsWith('.js'));
    
    // Generate imports
    const imports = jsFiles.map(file => {
      const fileName = file.replace('.js', '');
      let variableName = fileName.replace(/-/g, ''); // Remove hyphens for variable names
      
      // Handle filenames that start with numbers (invalid JS identifiers)
      if (/^\d/.test(variableName)) {
        // If starts with number, prefix with underscore
        variableName = '_' + variableName;
      }
      
      return `import ${variableName} from '../constants/trustCenterRegistry/${file}';`;
    }).join('\n');
    
    // Generate array items
    const arrayItems = jsFiles.map(file => {
      const fileName = file.replace('.js', '');
      let variableName = fileName.replace(/-/g, '');
      
      // Handle filenames that start with numbers (invalid JS identifiers)
      if (/^\d/.test(variableName)) {
        // If starts with number, prefix with underscore
        variableName = '_' + variableName;
      }
      
      return `  ${variableName}`;
    }).join(',\n');
    
    // Generate the complete file content
    const utilsContent = `// Auto-generated imports - DO NOT EDIT MANUALLY
// This file is automatically updated by generate-utils.js
${imports}

const trustCenterData = [
${arrayItems}
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

    // Write the file
    fs.writeFileSync(utilsPath, utilsContent);
    console.log(`✅ Generated utils/trustCenters.js with ${jsFiles.length} companies`);
    
  } catch (error) {
    console.error('❌ Error generating utils file:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateUtilsFile();
}

module.exports = generateUtilsFile;
