/**
 * Universal Platform Detection
 * Detects trust center platforms using CNAME and HTML analysis
 */

const fs = require('fs');
const { resolveCname } = require('dns').promises;

// Import trust center hosts from constants
const trustCenterHostsPath = require('path').join(__dirname, '../../constants/trust-center-hosts.js');
const trustCenterHosts = fs.existsSync(trustCenterHostsPath) 
  ? require(trustCenterHostsPath)
  : null;

// Platform indicators in HTML content
const PLATFORM_INDICATORS = {
  'Vanta': ['static.vanta.com', 'trust.vanta.com', 'vanta.com/trust'],
  'SafeBase': ['trust.safebase.io', 'safebase.io/trust'],
  'Drata': ['trust.drata.com', 'drata.com/trust'],
  'Secureframe': ['trust.secureframe.com', 'secureframe.com/trust', 'secureframetrust.com'],
  'Delve': ['trust.delve.co', 'delve.co/trust', 'Live monitoring by Delve'],
  'Conveyor': ['trust.conveyor.com', 'conveyor.com/trust', 'app.conveyor.com'],
  'HyperComply': ['trust.hypercomply.io', 'hypercomply.io/trust', 'proxy.hypercomplytrust.com'],
  'Oneleet': ['trust.oneleet.com', 'oneleet.com/trust'],
  'TrustArc': ['trust.trustarc.com', 'trustarc.com/trust'],
  'OneTrust': ['trust.onetrust.com', 'onetrust.com/trust'],
  'Whistic': ['app.whistic.com', 'whistic.com/trust'],
  'SecurityPal': ['securitypalhq.com', 'securitypal.com/trust']
};

/**
 * Detect platform from CNAME
 */
async function detectPlatformFromCNAME(hostname) {
  try {
    const cnameRecords = await resolveCname(hostname);
    if (!cnameRecords || cnameRecords.length === 0) {
      return null;
    }
    
    const cname = cnameRecords[0].toLowerCase();
    
    // Check against known hosts from constants
    if (trustCenterHosts && trustCenterHosts.KNOWN_HOSTS) {
      for (const [platform, hosts] of Object.entries(trustCenterHosts.PLATFORM_MAP)) {
        for (const host of hosts) {
          if (cname.includes(host.toLowerCase())) {
            return {
              platform,
              method: 'CNAME',
              cname
            };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    // No CNAME or DNS error
    return null;
  }
}

/**
 * Detect platform from HTML content
 */
async function detectPlatformFromHTML(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TrustListsBot/1.0)',
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const html = await response.text();
    
    // Check for platform indicators in HTML
    for (const [platform, indicators] of Object.entries(PLATFORM_INDICATORS)) {
      for (const indicator of indicators) {
        if (html.includes(indicator)) {
          return {
            platform,
            method: 'HTML',
            indicator
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Detect platform for a trust center URL
 */
async function detectPlatform(trustCenterUrl) {
  if (!trustCenterUrl) {
    return { platform: null, method: null };
  }
  
  try {
    const url = new URL(trustCenterUrl);
    const hostname = url.hostname;
    
    // Step 1: Try CNAME detection (faster and more reliable)
    const cnameResult = await detectPlatformFromCNAME(hostname);
    if (cnameResult) {
      return cnameResult;
    }
    
    // Step 2: Try HTML detection (fallback)
    const htmlResult = await detectPlatformFromHTML(trustCenterUrl);
    if (htmlResult) {
      return htmlResult;
    }
    
    return { platform: 'Unknown', method: null };
  } catch (error) {
    return { platform: 'Unknown', method: null, error: error.message };
  }
}

/**
 * Detect platforms for a list of companies with trust centers
 * 
 * @param {Array} companies - Array of company objects with trustCenterUrl
 * @param {Object} options - Options for detection
 * @param {string} options.outputPath - Path to save results
 * @param {boolean} options.saveProgress - Whether to save progress periodically
 * @returns {Array} Companies with platform information added
 */
async function detectPlatforms(companies, options = {}) {
  const {
    outputPath,
    saveProgress = true,
    progressInterval = 50
  } = options;
  
  // Filter to only companies with trust centers
  const companiesWithTrustCenters = companies.filter(c => c.trustCenterUrl);
  
  console.log('🔍 Starting platform detection...\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`   Total companies with trust centers: ${companiesWithTrustCenters.length}\n`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(companiesWithTrustCenters.length * 3 / 60)} minutes\n`);
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < companiesWithTrustCenters.length; i++) {
    const company = companiesWithTrustCenters[i];
    const progress = ((i / companiesWithTrustCenters.length) * 100).toFixed(1);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rate = i / elapsed || 1;
    const remaining = Math.floor((companiesWithTrustCenters.length - i) / rate);
    const remainingMin = Math.floor(remaining / 60);
    
    process.stdout.write(`\r📄 [${progress}%] ${i}/${companiesWithTrustCenters.length} | ETA: ${remainingMin}m | ${company.name.padEnd(40).substring(0, 40)}`);
    
    const detection = await detectPlatform(company.trustCenterUrl);
    
    results.push({
      ...company,
      platform: detection.platform,
      detectionMethod: detection.method,
      detectionDetails: detection.cname || detection.indicator || null
    });
    
    // Save progress periodically
    if (saveProgress && outputPath && (i + 1) % progressInterval === 0) {
      const tempPath = outputPath.replace('.json', '-temp.json');
      fs.writeFileSync(tempPath, JSON.stringify(results, null, 2));
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n\n✅ Platform detection complete!\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  // Platform breakdown
  const platformCounts = {};
  results.forEach(company => {
    const platform = company.platform || 'Unknown';
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
  });
  
  console.log('📈 Platform Breakdown:\n');
  console.log('─────────────────────────────────────────');
  const sorted = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([platform, count]) => {
    const percentage = ((count / results.length) * 100).toFixed(1);
    console.log(`   ${platform.padEnd(15)} ${count.toString().padStart(4)} companies (${percentage}%)`);
  });
  console.log();
  
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
  detectPlatforms,
  detectPlatform,
  detectPlatformFromCNAME,
  detectPlatformFromHTML
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node detect-platforms.js <input-file> <output-file>');
    console.log('');
    console.log('Example:');
    console.log('  node detect-platforms.js ../sources/techstars/trust-centers.json ../sources/techstars/platforms.json');
    process.exit(1);
  }
  
  const [inputPath, outputPath] = args;
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  const companies = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  detectPlatforms(companies, { outputPath })
    .then(() => {
      console.log('✅ Done!');
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

