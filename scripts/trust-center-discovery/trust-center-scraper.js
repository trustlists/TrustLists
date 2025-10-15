const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Import TrustList utilities to read existing companies
const { getAllTrustCenters } = require('../utils/trustCenters');

// Configuration
const CONFIG = {
  timeout: 5000, // 5 seconds timeout
  maxConcurrent: 5, // Don't overwhelm servers
  delayBetweenRequests: 100, // 100ms delay between requests
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

// Sample YC companies to test (first 10)
const YC_COMPANIES = [
  'stripe.com',
  'airbnb.com', 
  'dropbox.com',
  'reddit.com',
  'twitch.tv',
  'coinbase.com',
  'doordash.com',
  'instacart.com',
  'gitlab.com',
  'docker.com'
];

// Sample companies to test (you can expand this)
const TEST_COMPANIES = [
  'stripe.com',
  'shopify.com',
  'airbnb.com',
  'uber.com',
  'slack.com',
  'zoom.us',
  'dropbox.com',
  'notion.so',
  'figma.com',
  'canva.com',
  'mailchimp.com',
  'hubspot.com',
  'salesforce.com',
  'microsoft.com',
  'google.com',
  'amazon.com',
  'apple.com',
  'meta.com',
  'netflix.com',
  'spotify.com'
];

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
  
  // If we find 3+ trust center keywords, it's likely a trust center
  return keywordMatches.length >= 3;
}

// Generate URL variations for a domain
function generateUrlVariations(domain) {
  const variations = [];
  
  // Clean domain (remove www, protocol, etc.)
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  
  URL_PATTERNS.forEach(pattern => {
    const url = pattern.replace('{domain}', cleanDomain);
    variations.push(`https://${url}`);
  });
  
  return variations;
}

// Extract company name from domain
function extractCompanyName(domain) {
  // Remove common TLDs and subdomains
  const cleanDomain = domain.replace(/^(www\.|trust\.|security\.|compliance\.|privacy\.)/, '');
  const name = cleanDomain.split('.')[0];
  
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Extract company website URL
function getCompanyWebsite(domain) {
  const cleanDomain = domain.replace(/^(www\.)/, '');
  return `https://${cleanDomain}`;
}

// Test a single company
async function testCompany(domain) {
  console.log(`\n🔍 Testing ${domain}...`);
  
  const variations = generateUrlVariations(domain);
  const results = [];
  
  // Test each variation
  for (const url of variations) {
    try {
      console.log(`  Testing: ${url}`);
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
          companyName: extractCompanyName(domain),
          companyWebsite: getCompanyWebsite(domain),
          domain: domain
        });
        
        if (isTrustCenter) {
          console.log(`  ✅ Found potential trust center: ${url}`);
        } else {
          console.log(`  ⚠️  URL exists but doesn't look like trust center: ${url}`);
        }
      } else {
        console.log(`  ❌ Not found: ${url}`);
      }
      
      // Be respectful - small delay between requests
      await new Promise(resolve => setTimeout(resolve, CONFIG.delayBetweenRequests));
      
    } catch (error) {
      console.log(`  ❌ Error testing ${url}: ${error.message}`);
    }
  }
  
  return results.filter(result => result.status === 200);
}

// Main function
async function runScraper() {
  console.log('🚀 Starting Trust Center Discovery Scraper\n');
  
  // Get existing companies to skip
  const existingDomains = getExistingCompanies();
  
  // Use YC companies for this test
  const companiesToTest = YC_COMPANIES.filter(domain => {
    const cleanDomain = domain.replace('www.', '');
    return !existingDomains.includes(cleanDomain);
  });
  
  console.log(`📋 Testing ${companiesToTest.length} YC companies (${YC_COMPANIES.length - companiesToTest.length} already in database)`);
  console.log(`Using ${URL_PATTERNS.length} URL patterns per company\n`);
  
  if (companiesToTest.length === 0) {
    console.log('✅ All YC companies are already in your TrustList database!');
    return;
  }
  
  const allResults = [];
  
  for (const company of companiesToTest) {
    const results = await testCompany(company);
    allResults.push({
      company,
      trustCenters: results
    });
    
    // Small delay between companies
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate report
  console.log('\n📊 RESULTS SUMMARY');
  console.log('==================');
  
  const companiesWithTrustCenters = allResults.filter(result => result.trustCenters.length > 0);
  
  console.log(`\n✅ Companies with potential trust centers: ${companiesWithTrustCenters.length}/${companiesToTest.length}`);
  
  companiesWithTrustCenters.forEach(result => {
    console.log(`\n🏢 ${result.company}`);
    result.trustCenters.forEach(tc => {
      console.log(`   ${tc.isTrustCenter ? '✅' : '⚠️'} ${tc.url}`);
      console.log(`      Company: ${tc.companyName}`);
      console.log(`      Website: ${tc.companyWebsite}`);
      if (tc.keywordMatches.length > 0) {
        console.log(`      Keywords: ${tc.keywordMatches.join(', ')}`);
      }
    });
  });
  
  // Save results to file
  const reportData = {
    timestamp: new Date().toISOString(),
    totalCompanies: companiesToTest.length,
    companiesWithTrustCenters: companiesWithTrustCenters.length,
    skippedCompanies: YC_COMPANIES.length - companiesToTest.length,
    results: allResults
  };
  
  fs.writeFileSync('trust-center-discovery-results.json', JSON.stringify(reportData, null, 2));
  console.log('\n💾 Results saved to: trust-center-discovery-results.json');
  
  // Generate CSV for easy review
  const csvData = [];
  csvData.push('Company,Domain,URL,Status,Is Trust Center,Keywords');
  
  allResults.forEach(result => {
    if (result.trustCenters.length === 0) {
      csvData.push(`${result.company},${result.company},N/A,No trust centers found,N/A,N/A`);
    } else {
      result.trustCenters.forEach(tc => {
        const keywords = tc.keywordMatches.join('; ');
        csvData.push(`${result.company},${result.company},${tc.url},${tc.status},${tc.isTrustCenter},${keywords}`);
      });
    }
  });
  
  fs.writeFileSync('trust-center-discovery-results.csv', csvData.join('\n'));
  console.log('📄 CSV report saved to: trust-center-discovery-results.csv');
  
  // Generate copy-paste ready formats
  generateCopyPasteFormats(companiesWithTrustCenters);
}

// Generate copy-paste ready formats for easy addition to TrustList
function generateCopyPasteFormats(companiesWithTrustCenters) {
  console.log('\n📋 COPY-PASTE READY FORMATS');
  console.log('============================');
  
  // High confidence trust centers only
  const highConfidence = companiesWithTrustCenters
    .flatMap(result => result.trustCenters)
    .filter(tc => tc.isTrustCenter);
  
  if (highConfidence.length > 0) {
    console.log('\n🎯 HIGH CONFIDENCE TRUST CENTERS (Ready to add):');
    console.log('================================================');
    
    // JavaScript object format for easy copy-paste
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
    
    // Markdown table format
    console.log('\n📊 Markdown Table Format:');
    console.log('| Company | Website | Trust Center | Keywords |');
    console.log('|---------|---------|--------------|----------|');
    highConfidence.forEach(tc => {
      const keywords = tc.keywordMatches.slice(0, 3).join(', ');
      console.log(`| ${tc.companyName} | ${tc.companyWebsite} | ${tc.url} | ${keywords} |`);
    });
    
    // Simple list format
    console.log('\n📋 Simple List Format:');
    highConfidence.forEach(tc => {
      console.log(`• ${tc.companyName}: ${tc.url}`);
    });
    
    // Save to file
    const copyPasteData = {
      highConfidence: highConfidence.map(tc => ({
        companyName: tc.companyName,
        website: tc.companyWebsite,
        trustCenter: tc.url,
        iconUrl: `https://www.google.com/s2/favicons?domain=${tc.domain}&sz=128`,
        keywords: tc.keywordMatches,
        domain: tc.domain
      })),
      generatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('trust-centers-ready-to-add.json', JSON.stringify(copyPasteData, null, 2));
    console.log('\n💾 Ready-to-add data saved to: trust-centers-ready-to-add.json');
  }
  
  // All discoveries (including partial matches)
  const allDiscoveries = companiesWithTrustCenters
    .flatMap(result => result.trustCenters);
  
  if (allDiscoveries.length > 0) {
    console.log('\n🔍 ALL DISCOVERIES (Including partial matches):');
    console.log('===============================================');
    
    allDiscoveries.forEach(tc => {
      const confidence = tc.isTrustCenter ? 'HIGH' : 'PARTIAL';
      console.log(`${confidence}: ${tc.companyName} - ${tc.url}`);
    });
  }
}

// Run the scraper
if (require.main === module) {
  runScraper().catch(console.error);
}

module.exports = { runScraper, testCompany, generateUrlVariations };
