const fs = require('fs');

async function fetchAllTechstarsCompanies() {
  const baseUrl = 'https://8gbms7c94riane0lp-1.a1.typesense.net/collections/companies/documents/search';
  const apiKey = '0QKFSu4mIDX9UalfCNQN4qjg2xmukDE0';
  
  // Parameters from the request you found
  const params = new URLSearchParams({
    per_page: '100', // Increased from 36 to get more per page
    q: '', // Empty = all companies
    query_by: 'company_name,brief_description,city,state_province,country,worldregion,program_names,industry_vertical',
    sort_by: 'website_order:asc',
    filter_by: 'first_session_year:=[2007..2025]',
    facet_by: 'is_bcorp,is_1b,is_current_session,worldregion,is_exit,first_session_year,program_names,industry_vertical',
    max_facet_values: '200',
  });

  console.log('🚀 Fetching Techstars companies from their API...\n');
  console.log('📡 API Endpoint: Typesense Search\n');

  let allCompanies = [];
  let page = 1;
  let totalPages = 1;
  let totalFound = 0;

  try {
    // Fetch first page to get total count
    do {
      params.set('page', page.toString());
      const url = `${baseUrl}?${params.toString()}`;
      
      console.log(`📄 Fetching page ${page}/${totalPages}...`);
      
      const response = await fetch(url, {
        headers: {
          'accept': 'application/json',
          'x-typesense-api-key': apiKey,
          'origin': 'https://www.techstars.com',
        }
      });

      if (!response.ok) {
        console.error(`❌ Error: ${response.status} ${response.statusText}`);
        break;
      }

      const data = await response.json();
      
      // First page - get totals
      if (page === 1) {
        totalFound = data.found || 0;
        const perPage = parseInt(params.get('per_page'));
        totalPages = Math.ceil(totalFound / perPage);
        
        console.log(`\n📊 Total companies found: ${totalFound.toLocaleString()}`);
        console.log(`📑 Total pages: ${totalPages}\n`);
      }

      // Add companies from this page
      if (data.hits && data.hits.length > 0) {
        const companies = data.hits.map(hit => hit.document);
        allCompanies.push(...companies);
        console.log(`   ✓ Got ${companies.length} companies (total: ${allCompanies.length})`);
      } else {
        console.log('   ⚠️  No companies in this page');
        break;
      }

      page++;
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } while (page <= totalPages);

    console.log(`\n✅ Successfully fetched ${allCompanies.length.toLocaleString()} companies!\n`);

    // Save the raw data
    const outputPath = './techstars-companies-raw.json';
    fs.writeFileSync(outputPath, JSON.stringify(allCompanies, null, 2));
    console.log(`💾 Raw data saved to: ${outputPath}\n`);

    // Analyze the data structure
    if (allCompanies.length > 0) {
      const sampleCompany = allCompanies[0];
      console.log('📋 Sample Company Data Structure:');
      console.log('─────────────────────────────────────────');
      console.log(JSON.stringify(sampleCompany, null, 2).substring(0, 1000));
      console.log('...\n');

      // Show available fields
      console.log('🔑 Available Fields:');
      console.log('─────────────────────────────────────────');
      Object.keys(sampleCompany).forEach(key => {
        const value = sampleCompany[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        console.log(`   ${key}: ${type}`);
      });
      console.log();

      // Extract companies with websites
      const companiesWithWebsites = allCompanies.filter(c => c.website);
      console.log(`🌐 Companies with websites: ${companiesWithWebsites.length.toLocaleString()}`);

      // Create a simplified dataset
      const simplifiedData = allCompanies.map(company => ({
        name: company.company_name || company.name,
        website: company.website,
        description: company.brief_description || company.description,
        location: company.city && company.country ? `${company.city}, ${company.country}` : company.country,
        year: company.first_session_year,
        program: company.program_names,
        industries: company.industry_vertical,
        logo: company.logo_url,
        linkedin: company.linkedin_url,
        twitter: company.twitter_url,
      }));

      const simplifiedPath = './techstars-companies-simplified.json';
      fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedData, null, 2));
      console.log(`📊 Simplified data saved to: ${simplifiedPath}\n`);

      // Show sample companies
      console.log('🏢 Sample Companies:');
      console.log('─────────────────────────────────────────');
      simplifiedData.slice(0, 10).forEach(company => {
        console.log(`   ${company.name}`);
        if (company.website) console.log(`      🌐 ${company.website}`);
        if (company.description) console.log(`      📝 ${company.description.substring(0, 60)}...`);
        console.log();
      });

      console.log('🎯 Next Steps:');
      console.log('─────────────────────────────────────────');
      console.log('   1. Review the simplified JSON file');
      console.log('   2. Create a script to check each website for trust centers');
      console.log('   3. Auto-generate trust center entries for TrustLists');
      console.log('   4. Filter by industries relevant to your database\n');

      console.log('💡 Cost Analysis:');
      console.log('─────────────────────────────────────────');
      console.log('   Firecrawl credits used: 0 (direct API access!)');
      console.log('   API calls made: ' + page);
      console.log('   Cost: FREE! 🎉\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run it!
fetchAllTechstarsCompanies();

