const fs = require('fs');
const path = require('path');

// Read the trust centers data
const trustCentersPath = path.join(__dirname, '../public/trust-centers.json');
const trustCenters = JSON.parse(fs.readFileSync(trustCentersPath, 'utf-8'));

// Ensure public/api directory exists
const apiDir = path.join(__dirname, '../public/api');
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// Generate trust-centers.json (copy from public)
const trustCentersApiPath = path.join(apiDir, 'trust-centers.json');
fs.writeFileSync(trustCentersApiPath, JSON.stringify(trustCenters, null, 2));
console.log(`✅ Generated ${trustCentersApiPath}`);

// Generate stats.json
const platformCounts = trustCenters.data.reduce((acc, company) => {
  const platform = company.platform || 'Other';
  acc[platform] = (acc[platform] || 0) + 1;
  return acc;
}, {});

const platformCountsArray = Object.entries(platformCounts)
  .map(([platform, count]) => ({ platform, count }))
  .sort((a, b) => b.count - a.count);

const stats = {
  totalCompanies: trustCenters.data.length,
  platformCounts: platformCountsArray,
  generated: new Date().toISOString()
};

const statsPath = path.join(apiDir, 'stats.json');
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
console.log(`✅ Generated ${statsPath}`);

console.log(`\n📊 Stats: ${stats.totalCompanies} companies across ${platformCountsArray.length} platforms`);

