/**
 * Fetch Y Combinator Companies
 * Source: https://api.ycombinator.com/v0.1/companies
 */

const fs = require('fs');
const path = require('path');

async function fetchYCCompanies() {
  console.log('🚀 Fetching Y Combinator companies...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  let allCompanies = [];
  let url = 'https://api.ycombinator.com/v0.1/companies';
  let pageCount = 0;
  const startTime = Date.now();
  
  try {
    while (url) {
      pageCount++;
      process.stdout.write(`\r📄 Fetching page ${pageCount}...`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const companies = data.companies || [];
      allCompanies = allCompanies.concat(companies);
      
      // Get next page URL
      url = data.next || null;
      
      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n\n✅ Successfully fetched ${allCompanies.length} companies in ${elapsed}s!`);
    console.log(`   Pages fetched: ${pageCount}\n`);
    
    // Simplify the data structure
    const simplified = allCompanies.map(company => ({
      name: company.name,
      website: company.website,
      description: company.one_liner || company.long_description || '',
      batch: company.batch,
      status: company.status,
      tags: company.tags || [],
      industries: company.industries || [],
      regions: company.regions || []
    })).filter(company => company.website); // Only keep companies with websites
    
    console.log(`📊 Companies with websites: ${simplified.length}\n`);
    
    // Save raw data
    const rawPath = path.join(__dirname, 'companies-raw.json');
    fs.writeFileSync(rawPath, JSON.stringify(allCompanies, null, 2));
    console.log(`💾 Raw data saved to: companies-raw.json`);
    
    // Save simplified data
    const simplifiedPath = path.join(__dirname, 'companies.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplified, null, 2));
    console.log(`💾 Simplified data saved to: companies.json\n`);
    
    return simplified;
    
  } catch (error) {
    console.error('\n❌ Failed to fetch YC companies:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  fetchYCCompanies()
    .then(() => {
      console.log('✅ Done!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = { fetchYCCompanies };

