#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure dist/api directory exists
const distApiDir = path.join(__dirname, '../../dist/api');
if (!fs.existsSync(distApiDir)) {
  fs.mkdirSync(distApiDir, { recursive: true });
}

// Copy trust-centers.json from public/ to dist/api/
const trustCentersSource = path.join(__dirname, '../../public/trust-centers.json');
const trustCentersDest = path.join(distApiDir, 'trust-centers.json');

if (fs.existsSync(trustCentersSource)) {
  fs.copyFileSync(trustCentersSource, trustCentersDest);
  console.log('✅ Copied trust-centers.json to dist/api/');
} else {
  console.warn('⚠️  Warning: trust-centers.json not found in public/');
}

// Generate stats.json
const trustCentersData = JSON.parse(fs.readFileSync(trustCentersSource, 'utf8'));
const stats = {
  totalCompanies: trustCentersData.data.length,
  generated: new Date().toISOString()
};

const statsDest = path.join(distApiDir, 'stats.json');
fs.writeFileSync(statsDest, JSON.stringify(stats, null, 2));
console.log('✅ Generated stats.json in dist/api/');

console.log('🎯 API files ready in dist/api/');
