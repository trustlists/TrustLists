#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REGISTRY_DIR = path.join(process.cwd(), 'constants', 'trustCenterRegistry');

function removeDescriptionFromFile(filePath) {
  const fileName = path.basename(filePath);
  const companyName = fileName.replace('.js', '');
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if description field exists
  if (!content.includes('"description":')) {
    console.log(`✅ ${companyName}: No description field found`);
    return false;
  }
  
  // Remove the description field and its trailing comma
  const updatedContent = content.replace(/,\s*"description":\s*"[^"]*"/g, '');
  
  if (updatedContent === content) {
    console.log(`❌ ${companyName}: Failed to remove description`);
    return false;
  }
  
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`✅ ${companyName}: Description field removed`);
  return true;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  
  if (dryRun) {
    console.log('🔍 DRY RUN - No files will be modified');
  }
  
  const files = fs.readdirSync(REGISTRY_DIR)
    .filter(f => f.endsWith('.js'))
    .map(f => path.join(REGISTRY_DIR, f));
  
  console.log(`🚀 Processing ${files.length} company files...`);
  
  let updatedCount = 0;
  
  for (const filePath of files) {
    if (dryRun) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath).replace('.js', '');
      if (content.includes('"description":')) {
        console.log(`🔍 ${fileName}: Would remove description field`);
        updatedCount++;
      } else {
        console.log(`✅ ${fileName}: No description field found`);
      }
    } else {
      if (removeDescriptionFromFile(filePath)) {
        updatedCount++;
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  Files processed: ${files.length}`);
  console.log(`  Files updated: ${updatedCount}`);
  
  if (dryRun) {
    console.log('\n💡 Run without --dry-run to actually update files');
  } else {
    console.log('\n✅ Description fields removed! Run npm run generate to update JSON output');
  }
}

if (require.main === module) {
  main();
}
