const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Import TrustList utilities to read existing companies
const { getAllTrustCenters } = require('../../utils/trustCenters');

// Configuration
const CONFIG = {
  timeout: 5000, // 5 seconds timeout
  delayBetweenRequests: 100, // 100ms delay between requests
  delayBetweenCompanies: 200, // 200ms delay between companies
  maxCompaniesToTest: 10, // Set to number to limit testing (e.g., 100 for testing)
};

// Trust center URL patterns to test
const URL_PATTERNS = [
  'trust.{domain}',
  'trustcenter.{domain}',
  'security.{domain}',
  'compliance.{domain}',
  'privacy.{domain}',
  '{domain}/trust',
  '{domain}/security',
  '{domain}/compliance',
  '{domain}/privacy',
  '{domain}/trust-center',
  '{domain}/security-center',
];

// Keywords that indicate a trust center
const TRUST_CENTER_KEYWORDS = [
  'trust center',
  'security',
  'compliance',
  'privacy policy',
  'data protection',
  'SOC 2',
  'ISO 27001',
  'GDPR',
  'HIPAA',
  'certification',
  'audit',
  'security practices',
  'data security',
];

// Get existing companies from TrustList database
function getExistingCompanies() {
  try {
    const existingCompanies = getAllTrustCenters();
    const existingDomains = existingCompanies.map(company => {
      try {
        return new URL(company.website).hostname.replace('www.', '');
      } catch {
        return null;
      }
    }).filter(Boolean);
    
    console.log(`📊 Found ${existingCompanies.length} existing companies in TrustList database`);
    return existingDomains;
  } catch (error) {
    console.log('⚠️  Could not load existing companies, proceeding with all tests');
    return [];
  }
}

// Fetch all YC companies from API
async function fetchAllYCCompanies() {
  console.log('🚀 Fetching all YC companies from API...\n');
  
  let allCompanies = [];
  let url = 'https://api.ycombinator.com/v0.1/companies';
  let pageCount = 0;
  
  try {
    while (url) {
      pageCount++;
      console.log(`📄 Fetching page ${pageCount}: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const companies = data.companies || [];
      allCompanies = allCompanies.concat(companies);
      
      console.log(`   Found ${companies.length} companies on this page`);
      console.log(`   Total so far: ${allCompanies.length}`);
      
      url = data.nextPage;
      
      // Small delay between API requests
      if (url) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log(`\n✅ Successfully fetched ${allCompanies.length} YC companies!`);
    
    // Save raw data
    fs.writeFileSync('yc-companies-raw.json', JSON.stringify({
      totalCompanies: allCompanies.length,
      companies: allCompanies,
      fetchedAt: new Date().toISOString()
    }, null, 2));
    
    console.log('💾 Raw YC data saved to: yc-companies-raw.json');
    
    return allCompanies;
    
  } catch (error) {
    console.error('❌ Failed to fetch YC companies:', error.message);
    return [];
  }
}

// Extract company name from domain
function extractCompanyName(domain) {
  const cleanDomain = domain.replace(/^(www\.|trust\.|security\.|compliance\.|privacy\.)/, '');
  const name = cleanDomain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Extract company website URL
function getCompanyWebsite(domain) {
  const cleanDomain = domain.replace(/^(www\.)/, '');
  return `https://${cleanDomain}`;
}

// Generate URL variations for a domain
function generateUrlVariations(domain) {
  const variations = [];
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  
  URL_PATTERNS.forEach(pattern => {
    const url = pattern.replace('{domain}', cleanDomain);
    variations.push(`https://${url}`);
  });
  
  return variations;
}

// Utility function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : http;
    const request = client.get(url, { timeout: CONFIG.timeout }, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          url,
          status: response.statusCode,
          content: data,
          headers: response.headers
        });
      });
    });

    request.on('error', () => {
      resolve({ url, status: 0, content: '', headers: {} });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({ url, status: 0, content: '', headers: {} });
    });
  });
}

// Check if content looks like a trust center
function isTrustCenterContent(content) {
  const lowerContent = content.toLowerCase();
  const keywordMatches = TRUST_CENTER_KEYWORDS.filter(keyword => 
    lowerContent.includes(keyword.toLowerCase())
  );
  
  return keywordMatches.length >= 3;
}

// Test a single company
async function testCompany(company) {
  const domain = company.website;
  if (!domain) return [];
  
  console.log(`\n🔍 Testing ${company.name} (${domain})...`);
  
  const variations = generateUrlVariations(domain);
  const results = [];
  
  for (const url of variations) {
    try {
      const response = await makeRequest(url);
      
      if (response.status === 200) {
        const isTrustCenter = isTrustCenterContent(response.content);
        const keywordMatches = TRUST_CENTER_KEYWORDS.filter(keyword => 
          response.content.toLowerCase().includes(keyword.toLowerCase())
        );
        
        results.push({
          url,
          status: response.status,
          isTrustCenter,
          keywordMatches,
          companyName: company.name,
          companyWebsite: company.website,
          domain: domain,
          ycBatch: company.batch,
          ycStatus: company.status,
          ycIndustry: company.industries?.[0] || ''
        });
        
        if (isTrustCenter) {
          console.log(`  ✅ Found potential trust center: ${url}`);
        } else {
          console.log(`  ⚠️  URL exists but doesn't look like trust center: ${url}`);
        }
      } else {
        console.log(`  ❌ Not found: ${url}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
      
    } catch (error) {
      console.log(`  ❌ Error testing ${url}: ${error.message}`);
    }
  }
  
  return results.filter(result => result.status === 200);
}

// Main function
async function runFullDiscovery() {
  console.log('🚀 Starting Full YC Trust Center Discovery\n');
  console.log('==========================================\n');
  
  // Step 1: Get existing companies to skip
  const existingDomains = getExistingCompanies();
  
  // Step 2: Fetch all YC companies
  const allYCCompanies = await fetchAllYCCompanies();
  
  if (allYCCompanies.length === 0) {
    console.log('❌ No YC companies fetched, stopping.');
    return;
  }
  
  // Step 3: Filter out existing companies
  const companiesToTest = allYCCompanies.filter(company => {
    if (!company.website) return false;
    
    try {
      const domain = new URL(company.website).hostname.replace('www.', '');
      return !existingDomains.includes(domain);
    } catch {
      return false;
    }
  });
  
  console.log(`\n📋 Testing ${companiesToTest.length} new companies (${allYCCompanies.length - companiesToTest.length} already in database)`);
  console.log(`Using ${URL_PATTERNS.length} URL patterns per company\n`);
  
  if (companiesToTest.length === 0) {
    console.log('✅ All YC companies are already in your TrustList database!');
    return;
  }
  
  // Step 4: Limit testing if configured
  const finalCompaniesToTest = CONFIG.maxCompaniesToTest 
    ? companiesToTest.slice(0, CONFIG.maxCompaniesToTest)
    : companiesToTest;
  
  if (CONFIG.maxCompaniesToTest) {
    console.log(`⚠️  Limited to first ${CONFIG.maxCompaniesToTest} companies for testing\n`);
  }
  
  // Step 5: Test trust centers
  const allResults = [];
  let processedCount = 0;
  
  for (const company of finalCompaniesToTest) {
    processedCount++;
    console.log(`\n[${processedCount}/${finalCompaniesToTest.length}] Processing: ${company.name}`);
    
    const results = await testCompany(company);
    allResults.push({
      company: company.name,
      website: company.website,
      batch: company.batch,
      status: company.status,
      industry: company.industries?.[0] || '',
      trustCenters: results
    });
    
    // Delay between companies
    await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenCompanies));
  }
  
  // Step 6: Generate reports
  generateReports(allResults, finalCompaniesToTest.length);
}

// Generate comprehensive reports
function generateReports(allResults, totalTested) {
  console.log('\n📊 GENERATING REPORTS');
  console.log('====================');
  
  const companiesWithTrustCenters = allResults.filter(result => result.trustCenters.length > 0);
  const highConfidence = companiesWithTrustCenters
    .flatMap(result => result.trustCenters)
    .filter(tc => tc.isTrustCenter);
  
  console.log(`\n✅ Companies with potential trust centers: ${companiesWithTrustCenters.length}/${totalTested}`);
  console.log(`🎯 High confidence trust centers: ${highConfidence.length}`);
  
  // Detailed results
  companiesWithTrustCenters.forEach(result => {
    console.log(`\n🏢 ${result.company} (${result.batch})`);
    result.trustCenters.forEach(tc => {
      console.log(`   ${tc.isTrustCenter ? '✅' : '⚠️'} ${tc.url}`);
      console.log(`      Keywords: ${tc.keywordMatches.join(', ')}`);
    });
  });
  
  // Save comprehensive results
  const reportData = {
    timestamp: new Date().toISOString(),
    totalCompaniesTested: totalTested,
    companiesWithTrustCenters: companiesWithTrustCenters.length,
    highConfidenceTrustCenters: highConfidence.length,
    results: allResults
  };
  
  fs.writeFileSync('trust-center-discovery-results.json', JSON.stringify(reportData, null, 2));
  console.log('\n💾 Detailed results saved to: trust-center-discovery-results.json');
  
  // Generate CSV
  const csvData = [];
  csvData.push('Company,Website,Batch,Status,Industry,TrustCenterURL,IsTrustCenter,Keywords');
  
  allResults.forEach(result => {
    if (result.trustCenters.length === 0) {
      csvData.push(`${result.company},${result.website},${result.batch},${result.status},${result.industry},N/A,No trust centers found,N/A`);
    } else {
      result.trustCenters.forEach(tc => {
        const keywords = tc.keywordMatches.join('; ');
        csvData.push(`${result.company},${result.website},${result.batch},${result.status},${result.industry},${tc.url},${tc.isTrustCenter},${keywords}`);
      });
    }
  });
  
  fs.writeFileSync('trust-center-discovery-results.csv', csvData.join('\n'));
  console.log('📄 CSV report saved to: trust-center-discovery-results.csv');
  
  // Generate copy-paste ready formats
  generateCopyPasteFormats(highConfidence);
}

// Generate copy-paste ready formats
function generateCopyPasteFormats(highConfidence) {
  console.log('\n📋 COPY-PASTE READY FORMATS');
  console.log('============================');
  
  if (highConfidence.length > 0) {
    console.log('\n🎯 HIGH CONFIDENCE TRUST CENTERS (Ready to add):');
    console.log('================================================');
    
    // JavaScript object format
    console.log('\n📝 JavaScript Object Format:');
    highConfidence.forEach(tc => {
      console.log(`export default {
  name: "${tc.companyName}",
  website: "${tc.companyWebsite}",
  trustCenter: "${tc.url}",
  iconUrl: "https://www.google.com/s2/favicons?domain=${tc.domain}&sz=128"
};`);
      console.log('');
    });
    
    // Save ready-to-add data
    const copyPasteData = {
      highConfidence: highConfidence.map(tc => ({
        companyName: tc.companyName,
        website: tc.companyWebsite,
        trustCenter: tc.url,
        iconUrl: `https://www.google.com/s2/favicons?domain=${tc.domain}&sz=128`,
        keywords: tc.keywordMatches,
        domain: tc.domain,
        ycBatch: tc.ycBatch,
        ycStatus: tc.ycStatus,
        ycIndustry: tc.ycIndustry
      })),
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('trust-centers-ready-to-add.json', JSON.stringify(copyPasteData, null, 2));
    console.log('\n💾 Ready-to-add data saved to: trust-centers-ready-to-add.json');
  }
  
  console.log('\n🎉 Discovery complete! Check the generated files for results.');
}

// Run if called directly
if (require.main === module) {
  runFullDiscovery().catch(console.error);
}

module.exports = { runFullDiscovery, fetchAllYCCompanies };
