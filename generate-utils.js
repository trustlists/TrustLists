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
  // Priority companies that should appear first (vendor-hosted only)
  const priorityCompanies = [
    '1Password',    // Conveyor - Password manager leader
    'Figma',         // Conveyor - Design tool leader  
    'MongoDB',       // Conveyor - Database leader
    'Notion',        // Whistic - Productivity leader
    'Postman',       // SafeBase - API tool leader
    'Vercel',        // SafeBase - Deployment platform leader
    'Zapier',        // Conveyor - Automation leader
    'Betterment',    // Conveyor - Fintech
    'Carta',         // Conveyor - Equity management
    'Checkr',        // SafeBase - Background checks
    'Hubspot',       // SafeBase - CRM
    'Linear'         // Vanta - Project management
  ];
  
  // Sort with priority companies first, then alphabetical
  return trustCenterData.sort((a, b) => {
    const aIsPriority = priorityCompanies.includes(a.name);
    const bIsPriority = priorityCompanies.includes(b.name);
    
    // If both are priority, sort by priority order
    if (aIsPriority && bIsPriority) {
      return priorityCompanies.indexOf(a.name) - priorityCompanies.indexOf(b.name);
    }
    
    // If only a is priority, a comes first
    if (aIsPriority && !bIsPriority) {
      return -1;
    }
    
    // If only b is priority, b comes first
    if (!aIsPriority && bIsPriority) {
      return 1;
    }
    
    // If neither is priority, sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

export function getTrustCenterByName(name) {
  const trustCenters = getAllTrustCenters();
  return trustCenters.find(tc => tc.name === name);
}

export function searchTrustCenters(query) {
  let trustCenters = getAllTrustCenters();

  // Apply search query - only search company names
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase();
    trustCenters = trustCenters.filter(tc =>
      tc.name && tc.name.toLowerCase().includes(searchTerm)
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

export function getPlatformCounts() {
  const trustCenters = getAllTrustCenters();
  
  // Get platform from company data (same logic as in index.js)
  const getPlatform = (company) => {
    if (company.platform) return company.platform;
    
    const url = company.trustCenter;
    if (!url) return 'Other';
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host.includes('safebase.io')) return 'SafeBase';
      if (host.includes('app.conveyor.com') || host.includes('conveyor.com')) return 'Conveyor';
      if (host.includes('delve.co')) return 'Delve';
      if (host.includes('trust.vanta.com') || host.includes('vanta.com') || host.includes('vantatrust.com')) return 'Vanta';
      if (host.includes('drata.com')) return 'Drata';
      if (host.includes('trustarc.com')) return 'TrustArc';
      if (host.includes('onetrust.com')) return 'OneTrust';
      if (host.includes('secureframe.com')) return 'Secureframe';
      if (host.includes('whistic.com')) return 'Whistic';
      if (host.includes('oneleet.com')) return 'Oneleet';
      if (host.includes('hypercomply.io') || host.includes('hypercomplytrust.com')) return 'HyperComply';
      if (host.startsWith('trust.') || host.includes('.trust.') || host.startsWith('security.') || host.includes('.security.')) return 'Self-hosted';
      return 'Other';
    } catch {
      return 'Other';
    }
  };

  // Count companies by platform
  const counts = {};
  trustCenters.forEach(company => {
    const platform = getPlatform(company);
    counts[platform] = (counts[platform] || 0) + 1;
  });

  // Convert to array and sort by count (highest first)
  const platformCounts = Object.entries(counts)
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  return platformCounts;
}
`;

  fs.writeFileSync(utilsPath, utilsContent);
  console.log(`✅ Generated utils/trustCenters.js with ${imports.length} companies`);
}

if (require.main === module) {
  generateUtils();
}

module.exports = generateUtils;