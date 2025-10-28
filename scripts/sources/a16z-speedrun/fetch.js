const fs = require('fs');
const path = require('path');

async function fetchAllA16zSpeedrunCompanies() {
  console.log('🚀 Fetching a16z Speedrun companies...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const baseUrl = 'https://speedrun.a16z.com/api/companies/companyparams';
  let offset = 0;
  const limit = 100; // Fetch 100 at a time for efficiency
  let allCompanies = [];
  let pageCount = 0;

  try {
    while (true) {
      pageCount++;
      const url = `${baseUrl}?offset=${offset}&limit=${limit}&ordering=name`;
      
      console.log(`📄 Fetching page ${pageCount} (offset: ${offset})...`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // API returns {count, next, previous, results}
      if (!data || !data.results || data.results.length === 0) {
        console.log('   ℹ️  No more companies found\n');
        break;
      }
      
      const companies = data.results;
      console.log(`   ✓ Got ${companies.length} companies (total: ${allCompanies.length + companies.length}/${data.count})`);
      
      allCompanies = allCompanies.concat(companies);
      
      // If there's no next page, we're done
      if (!data.next || companies.length < limit) {
        console.log('   ℹ️  Reached end of results\n');
        break;
      }
      
      offset += limit;
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✅ Successfully fetched ${allCompanies.length} a16z Speedrun companies!\n`);
    
    // Save raw data
    const rawOutputPath = path.join(__dirname, 'a16z-speedrun-companies-raw.json');
    fs.writeFileSync(rawOutputPath, JSON.stringify(allCompanies, null, 2));
    console.log(`💾 Raw data saved to: ${rawOutputPath}\n`);
    
    // Create simplified version
    const simplifiedData = allCompanies.map(company => ({
      name: company.name || '',
      website: company.website_url || '',
      description: company.description || '',
      preamble: company.preamble || '',
      cohort: company.cohort || '',
      city: company.city || '',
      state: company.state || '',
      country: company.country || '',
      teamSize: company.team_size || null,
      founded: company.founded_year || null,
      industries: company.industries || [],
    }));
    
    const simplifiedPath = path.join(__dirname, 'a16z-speedrun-companies-simplified.json');
    fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedData, null, 2));
    console.log(`💾 Simplified data saved to: ${simplifiedPath}\n`);
    
    // Generate stats
    console.log('📊 Statistics:');
    console.log('─────────────────────────────────────────');
    console.log(`   Total companies: ${allCompanies.length.toLocaleString()}`);
    
    const companiesWithWebsites = simplifiedData.filter(c => c.website);
    console.log(`   Companies with websites: ${companiesWithWebsites.length.toLocaleString()}`);
    
    const cohorts = [...new Set(allCompanies.map(c => c.cohort).filter(Boolean))];
    console.log(`   Cohorts: ${cohorts.length} (${cohorts.sort().join(', ')})`);
    
    const locations = [...new Set(allCompanies.map(c => c.location).filter(Boolean))];
    console.log(`   Locations: ${locations.length}`);
    console.log();
    
    // Show sample companies
    console.log('📋 Sample companies:');
    console.log('─────────────────────────────────────────');
    simplifiedData.slice(0, 5).forEach((company, index) => {
      console.log(`\n${index + 1}. ${company.name}`);
      if (company.website) console.log(`   🌐 Website: ${company.website}`);
      if (company.cohort) console.log(`   🎓 Cohort: ${company.cohort}`);
      if (company.location) console.log(`   📍 Location: ${company.location}`);
      if (company.description) {
        const desc = company.description.substring(0, 80);
        console.log(`   📝 ${desc}${company.description.length > 80 ? '...' : ''}`);
      }
    });
    console.log('\n');
    
    console.log('🎯 Next Steps:');
    console.log('─────────────────────────────────────────');
    console.log('   1. Review the company data');
    console.log('   2. Run trust center discovery');
    console.log('   3. Generate CSV if needed\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    
    // Save partial results if any
    if (allCompanies.length > 0) {
      const partialPath = path.join(__dirname, 'a16z-speedrun-companies-partial.json');
      fs.writeFileSync(partialPath, JSON.stringify(allCompanies, null, 2));
      console.log(`\n💾 Saved ${allCompanies.length} companies to: ${partialPath}`);
    }
  }
}

fetchAllA16zSpeedrunCompanies();

