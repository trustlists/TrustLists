/**
 * Universal Trust Center Discovery
 * Works with any company list from any source
 */

const fs = require('fs');
const path = require('path');

// URL patterns to check for trust centers
// NOTE: For AUTO-PR, only subdomain patterns with verified CNAME are used
// Path patterns (/privacy, /security) often lead to false positives
const URL_PATTERNS = [
  // Subdomain patterns (check first - higher priority)
  { pattern: 'trust', type: 'subdomain' },
  { pattern: 'security', type: 'subdomain' },
  { pattern: 'compliance', type: 'subdomain' },
  { pattern: 'trustcenter', type: 'subdomain' }
  
  // Path patterns REMOVED - too many false positives
  // These are often just privacy policy pages, not trust centers
  // { pattern: '/trust', type: 'path' },
  // { pattern: '/security', type: 'path' },
  // { pattern: '/trust-center', type: 'path' },
  // { pattern: '/compliance', type: 'path' },
  // { pattern: '/privacy', type: 'path' }
];

/**
 * Check if a URL returns a valid response
 */
async function checkUrl(url, method = 'HEAD') {
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrustListsBot/1.0)',
      }
    });
    
    return {
      url,
      status: response.status,
      ok: response.ok
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

/**
 * Check for trust center at a company's website
 */
async function checkForTrustCenter(website) {
  const baseUrl = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const results = [];
  
  // ONLY check subdomain patterns (trust.*, security.*, etc.)
  // Path patterns are too prone to false positives (privacy policies, etc.)
  for (const { pattern, type } of URL_PATTERNS) {
    const url = `https://${pattern}.${baseUrl}`;
    let result = await checkUrl(url, 'HEAD');
    
    // Fallback to GET if HEAD returns 405
    if (result.status === 405) {
      result = await checkUrl(url, 'GET');
    }
    
    if (result.ok) {
      return { url: result.url, found: true, type: 'subdomain' };
    }
  }
  
  return { found: false };
}

/**
 * Discover trust centers for a list of companies
 * 
 * @param {Array} companies - Array of company objects with at least { name, website }
 * @param {Object} options - Options for discovery
 * @param {string} options.outputPath - Path to save results
 * @param {boolean} options.saveProgress - Whether to save progress periodically
 * @returns {Array} Companies with trust center URLs added
 */
async function discoverTrustCenters(companies, options = {}) {
  const {
    outputPath,
    saveProgress = true,
    progressInterval = 50
  } = options;
  
  console.log('🔍 Starting trust center discovery...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`   Total companies: ${companies.length}\n`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(companies.length * 2 / 60)} minutes\n`);
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];
    const progress = ((i / companies.length) * 100).toFixed(1);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rate = i / elapsed || 1;
    const remaining = Math.floor((companies.length - i) / rate);
    const remainingMin = Math.floor(remaining / 60);
    
    process.stdout.write(`\r📄 [${progress}%] ${i}/${companies.length} | ETA: ${remainingMin}m | ${company.name.padEnd(40).substring(0, 40)}`);
    
    if (!company.website) {
      results.push({ ...company, trustCenterUrl: null });
      continue;
    }
    
    const result = await checkForTrustCenter(company.website);
    
    results.push({
      ...company,
      trustCenterUrl: result.found ? result.url : null,
      trustCenterType: result.found ? result.type : null
    });
    
    // Save progress periodically
    if (saveProgress && outputPath && (i + 1) % progressInterval === 0) {
      const tempPath = outputPath.replace('.json', '-temp.json');
      fs.writeFileSync(tempPath, JSON.stringify(results, null, 2));
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n\n✅ Discovery complete!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  const withTrustCenters = results.filter(c => c.trustCenterUrl);
  console.log(`   Total companies: ${results.length}`);
  console.log(`   With trust centers: ${withTrustCenters.length} (${((withTrustCenters.length / results.length) * 100).toFixed(1)}%)\n`);
  
  // Save final results
  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`💾 Results saved to: ${outputPath}\n`);
    
    // Delete temp file if it exists
    const tempPath = outputPath.replace('.json', '-temp.json');
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
  
  return results;
}

module.exports = {
  discoverTrustCenters,
  checkForTrustCenter
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node discover-trust-centers.js <input-file> <output-file>');
    console.log('');
    console.log('Example:');
    console.log('  node discover-trust-centers.js ../sources/techstars/companies.json ../sources/techstars/trust-centers.json');
    process.exit(1);
  }
  
  const [inputPath, outputPath] = args;
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  const companies = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  discoverTrustCenters(companies, { outputPath })
    .then(() => {
      console.log('✅ Done!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

