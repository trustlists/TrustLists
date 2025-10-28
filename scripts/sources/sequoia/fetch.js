const fs = require('fs');

async function fetchAllSequoiaCompanies() {
  const url = 'https://sequoiacap.com/our-companies/';
  
  console.log('🚀 Fetching Sequoia Capital portfolio companies...\n');
  console.log('📡 API Endpoint: Sequoia Capital (FacetWP)\n');
  
  let allCompanies = [];
  let page = 1;
  let totalPages = 1;
  
  try {
    // Fetch first page to get total
    const firstPayload = {
      action: 'facetwp_refresh',
      data: {
        facets: {
          categories: [],
          partners: [],
          stage_current: [],
          stage_at_investment: [],
          'load-more': []
        },
        frozen_facets: {},
        http_params: {
          get: [],
          uri: 'our-companies',
          url_vars: []
        },
        template: 'wp',
        extras: {
          selections: true,
          sort: 'default'
        },
        soft_refresh: 1,
        is_bfcache: 1,
        first_load: 0,
        paged: 1
      }
    };
    
    const firstResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Origin': 'https://sequoiacap.com',
        'Referer': 'https://sequoiacap.com/our-companies/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      body: JSON.stringify(firstPayload),
    });
    
    const firstData = await firstResponse.json();
    
    if (firstData.settings && firstData.settings.pager) {
      const totalRows = firstData.settings.pager.total_rows;
      const perPage = firstData.settings.pager.per_page;
      totalPages = firstData.settings.pager.total_pages;
      
      console.log(`📊 Total companies: ${totalRows}`);
      console.log(`📑 Total pages: ${totalPages}\n`);
    }
    
    // Fetch all pages
    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      console.log(`📄 Fetching page ${currentPage}/${totalPages}...`);
      
      const payload = {
        action: 'facetwp_refresh',
        data: {
          facets: {
            categories: [],
            partners: [],
            stage_current: [],
            stage_at_investment: [],
            'load-more': []
          },
          frozen_facets: {},
          http_params: {
            get: [],
            uri: 'our-companies',
            url_vars: []
          },
          template: 'wp',
          extras: {
            selections: true,
            sort: 'default'
          },
          soft_refresh: 1,
          is_bfcache: 1,
          first_load: 0,
          paged: currentPage
        }
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Origin': 'https://sequoiacap.com',
          'Referer': 'https://sequoiacap.com/our-companies/',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        console.error(`❌ Error: ${response.status} ${response.statusText}`);
        break;
      }
      
      const data = await response.json();
      
      // Save first page for reference
      if (currentPage === 1) {
        fs.writeFileSync('./sequoia-response-raw.json', JSON.stringify(data, null, 2));
      }
      
      // Parse HTML template
      if (data.template) {
        const html = data.template;
        
        // Extract table rows (skip header and child rows)
        const rowMatches = [...html.matchAll(/<tr[^>]*data-toggle="collapse"[^>]*>(.*?)<\/tr>/gs)];
        
        for (const match of rowMatches) {
          const rowHtml = match[1];
          
          // Extract data from table cells
          const nameMatch = rowHtml.match(/<th[^>]*class="[^"]*company-listing__head[^"]*"[^>]*>([^<]+)</);
          const descMatch = rowHtml.match(/<td[^>]*class="[^"]*company-listing__text[^"]*"[^>]*>([^<]+)</);
          const stageMatch = rowHtml.match(/<td[^>]*data-order="\d+"[^>]*>([^<]+)<\/td>/);
          const partnerMatches = [...rowHtml.matchAll(/<li>([^<]+)<\/li>/g)];
          const firstMatch = rowHtml.match(/<td[^>]*class="[^"]*u-xl-hide[^"]*"[^>]*>([^<]+)<\/td>/);
          
          if (nameMatch) {
            const company = {
              name: nameMatch[1].trim(),
              description: descMatch ? descMatch[1].trim() : '',
              stage: stageMatch ? stageMatch[1].trim() : '',
              partners: partnerMatches.map(m => m[1].trim()),
              firstPartnered: firstMatch ? firstMatch[1].trim() : '',
            };
            
            allCompanies.push(company);
          }
        }
        
        console.log(`   ✓ Got ${rowMatches.length} companies (total: ${allCompanies.length})`);
      }
      
      // Small delay to be respectful
      if (currentPage < totalPages) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log(`\n✅ Successfully fetched ${allCompanies.length} companies!\n`);
    
    // Save raw data
    fs.writeFileSync('./sequoia-companies-raw.json', JSON.stringify(allCompanies, null, 2));
    console.log('💾 Raw data saved to: ./sequoia-companies-raw.json\n');
    
    // Create simplified dataset
    const simplifiedData = allCompanies.map(company => ({
      name: company.name,
      description: company.description,
      stage: company.stage,
      partners: company.partners,
      firstPartnered: company.firstPartnered,
      // Note: Website URLs are not in the table, would need individual page scraping
      website: null,
    }));
    
    fs.writeFileSync('./sequoia-companies-simplified.json', JSON.stringify(simplifiedData, null, 2));
    console.log('📊 Simplified data saved to: ./sequoia-companies-simplified.json\n');
    
    // Stats
    console.log('📊 Stats:');
    console.log('─────────────────────────────────────────');
    console.log(`   Total companies: ${simplifiedData.length}`);
    console.log(`   IPO companies: ${simplifiedData.filter(c => c.stage === 'IPO').length}`);
    console.log(`   Growth stage: ${simplifiedData.filter(c => c.stage === 'Growth').length}`);
    console.log(`   Early stage: ${simplifiedData.filter(c => c.stage === 'Early').length}`);
    console.log();
    
    // Show sample companies
    console.log('🏢 Sample Companies:');
    console.log('─────────────────────────────────────────');
    simplifiedData.slice(0, 15).forEach(company => {
      console.log(`   ${company.name}`);
      if (company.description) console.log(`      📝 ${company.description.substring(0, 60)}...`);
      if (company.stage) console.log(`      📈 Stage: ${company.stage}`);
      console.log();
    });
    
    console.log('⚠️  Note: Website URLs are not in the table data.');
    console.log('   To get websites, we would need to scrape individual company pages.\n');
    
    console.log('🎯 Next Steps:');
    console.log('─────────────────────────────────────────');
    console.log('   1. Review the simplified JSON file');
    console.log('   2. Decide if you want to scrape individual pages for websites');
    console.log('   3. Or manually add high-priority companies (Stripe, Airbnb, etc.)\n');
    
    console.log('💡 Notable Companies in Dataset:');
    const notable = ['Stripe', 'Airbnb', 'Snowflake', 'DoorDash', 'Figma', 'Reddit', 'Vanta', 'Retool'];
    notable.forEach(name => {
      const found = simplifiedData.find(c => c.name === name);
      if (found) console.log(`   ✅ ${name} - ${found.stage}`);
    });
    console.log();
    
    console.log('💳 Cost: FREE! (direct API access)\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run it!
fetchAllSequoiaCompanies();
