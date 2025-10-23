#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure dist/api directory exists
const distApiDir = path.join(__dirname, '../../dist/api');
if (!fs.existsSync(distApiDir)) {
  fs.mkdirSync(distApiDir, { recursive: true });
}

// Copy API files from public/api to dist/api
const publicApiDir = path.join(__dirname, '../../public/api');
const apiFiles = ['trust-centers.json', 'stats.json'];

apiFiles.forEach(file => {
  const sourcePath = path.join(publicApiDir, file);
  const destPath = path.join(distApiDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to dist/api/`);
  } else {
    console.warn(`⚠️  Warning: ${file} not found in public/api/`);
  }
});

console.log('🎯 API files copied to dist/api/');
