/**
 * Known Trust Center Hosting Platforms
 * 
 * This is the single source of truth for trust center platform detection.
 * All scripts should import from this file to ensure consistency.
 * 
 * Each entry maps CNAME patterns to their platform provider.
 */

module.exports = {
  // Known trust center hosting platforms and their CNAME patterns
  KNOWN_HOSTS: [
    // Vanta
    'trust.vanta.com',
    'vantatrust.com',
    'cname.vantatrust.com',
    
    // SafeBase
    'trust.safebase.io',
    'safebase.io',
    
    // Drata (classified as SafeBase per policy)
    'trust.drata.com',
    'drata.com',
    
    // Secureframe
    'trust.secureframe.com',
    'secureframe.com',
    'secureframetrust.com',
    
    // Delve (uses trust.delve.co/company-slug pattern)
    'trust.delve.co',
    'delve.co',
    'delve.co.',
    
    // Conveyor
    'trust.conveyor.com',
    'app.conveyor.com',
    'conveyor.com',
    'aptible.in',
    
    // HyperComply
    'trust.hypercomply.io',
    'hypercomply.io',
    'proxy.hypercomplytrust.com',
    'hypercomplytrust.com',
    
    // Oneleet
    'trust.oneleet.com',
    'oneleet.com',
    
    // TrustArc
    'trust.trustarc.com',
    'trustarc.com',
    
    // OneTrust
    'trust.onetrust.com',
    'onetrust.com',
    
    // Whistic
    'trust.whistic.com',
    'whistic.com',
    
    // SecurityPal
    'securitypal.com',
    'trust.securitypal.com',
    
    // Sprinto (uses CloudFront)
    // Note: Detected by cloudfront.net CNAME + trust subdomain pattern
  ],
  
  // Platform mapping from CNAME/host patterns
  PLATFORM_MAP: {
    'vantatrust.com': 'Vanta',
    'trust.vanta.com': 'Vanta',
    'vanta.com': 'Vanta',
    
    'safebase.io': 'SafeBase',
    'trust.safebase.io': 'SafeBase',
    
    'drata.com': 'SafeBase', // Per policy: Drata → SafeBase
    'trust.drata.com': 'SafeBase',
    
    'secureframe.com': 'Secureframe',
    'secureframetrust.com': 'Secureframe',
    'trust.secureframe.com': 'Secureframe',
    
    'delve.co': 'Delve',
    'trust.delve.co': 'Delve',
    
    'conveyor.com': 'Conveyor',
    'app.conveyor.com': 'Conveyor',
    'aptible.in': 'Conveyor',
    
    'hypercomply.io': 'HyperComply',
    'hypercomplytrust.com': 'HyperComply',
    
    'oneleet.com': 'Oneleet',
    
    'trustarc.com': 'TrustArc',
    
    'onetrust.com': 'OneTrust',
    
    'whistic.com': 'Whistic',
    
    'securitypal.com': 'SecurityPal',
  },
  
  // Confidence scoring
  CONFIDENCE_WEIGHTS: {
    CNAME_MATCH: 80,        // CNAME points to known host
    TRUST_SUBDOMAIN: 15,    // trust.company.com
    TRUST_SUBDOMAIN_WITH_CNAME: 75, // trust.company.com with ANY CNAME (likely new platform)
    TRUSTCENTER_SUBDOMAIN: 10, // trustcenter.company.com
    TRUSTCENTER_WITH_CNAME: 70, // trustcenter.company.com with ANY CNAME
    SECURITY_SUBDOMAIN: 5,  // security.company.com
    COMPLIANCE_SUBDOMAIN: 5, // compliance.company.com
    KEYWORD_MATCH: 2,       // Per keyword (max 10)
    MAX_KEYWORD_BONUS: 10,
  },
  
  // Helper function to check if a CNAME matches a known host
  isKnownHost(cname) {
    if (!cname) return false;
    const cnameLower = cname.toLowerCase();
    return this.KNOWN_HOSTS.some(host => cnameLower.includes(host.toLowerCase()));
  },
  
  // Helper function to get platform from CNAME
  getPlatformFromCname(cname) {
    if (!cname) return null;
    const cnameLower = cname.toLowerCase();
    
    for (const [pattern, platform] of Object.entries(this.PLATFORM_MAP)) {
      if (cnameLower.includes(pattern.toLowerCase())) {
        return platform;
      }
    }
    
    return null;
  },
  
  // Helper function to calculate confidence score
  calculateConfidence(url, cname, keywordMatches = [], httpStatus = null) {
    const urlLower = url.toLowerCase();
    const hasCname = !!cname;
    
    // Check if CNAME points to known trust center host
    const isKnownPlatform = this.isKnownHost(cname);
    
    // CNAME to known trust center host = 100% confidence (guaranteed trust center)
    if (isKnownPlatform) {
      return 100;
    }
    
    // Delve URLs that return 200 OK = 100% confidence (verified trust center)
    if (urlLower.includes('trust.delve.co/') && httpStatus === 200) {
      return 100;
    }
    
    // For non-known platforms, calculate confidence based on signals
    let confidence = 0;
    
    // trust.* subdomain with ANY CNAME (but not known platform) = likely a new platform (high confidence)
    if (hasCname && urlLower.includes('trust.')) {
      confidence += this.CONFIDENCE_WEIGHTS.TRUST_SUBDOMAIN_WITH_CNAME;
    }
    // trustcenter.* subdomain with ANY CNAME (but not known platform) = likely a new platform
    else if (hasCname && urlLower.includes('trustcenter.')) {
      confidence += this.CONFIDENCE_WEIGHTS.TRUSTCENTER_WITH_CNAME;
    }
    
    // Add subdomain bonuses
    if (urlLower.includes('trust.')) {
      confidence += this.CONFIDENCE_WEIGHTS.TRUST_SUBDOMAIN;
    }
    if (urlLower.includes('trustcenter.')) {
      confidence += this.CONFIDENCE_WEIGHTS.TRUSTCENTER_SUBDOMAIN;
    }
    if (urlLower.includes('security.')) {
      confidence += this.CONFIDENCE_WEIGHTS.SECURITY_SUBDOMAIN;
    }
    if (urlLower.includes('compliance.')) {
      confidence += this.CONFIDENCE_WEIGHTS.COMPLIANCE_SUBDOMAIN;
    }
    
    // Keyword bonus (max 10 points)
    const keywordBonus = Math.min(
      keywordMatches.length * this.CONFIDENCE_WEIGHTS.KEYWORD_MATCH,
      this.CONFIDENCE_WEIGHTS.MAX_KEYWORD_BONUS
    );
    confidence += keywordBonus;
    
    return Math.min(confidence, 100);
  },
  
  // Helper function to detect potential new trust center platforms
  isPotentialNewPlatform(url, cname) {
    if (!cname) return false;
    
    const urlLower = url.toLowerCase();
    
    // trust.* or trustcenter.* subdomain with a CNAME that's not in our known list
    if ((urlLower.includes('trust.') || urlLower.includes('trustcenter.')) && !this.isKnownHost(cname)) {
      return true;
    }
    
    return false;
  }
};

