#!/bin/bash

# Cleanup script for Trustlist project
# Removes temporary files, logs, and test scripts

echo "🧹 Starting cleanup..."
echo ""

# Function to safely delete files
safe_delete() {
    if [ -f "$1" ]; then
        rm "$1"
        echo "   ✓ Deleted: $1"
    fi
}

# ============================================
# TECHSTARS CLEANUP
# ============================================
echo "📁 Cleaning Techstars folder..."

cd techstars/

# Delete logs
safe_delete "cname-analysis.log"
safe_delete "cname-detection.log"
safe_delete "techstars-discovery-output.log"
safe_delete "techstars-full-scan.log"
safe_delete "techstars-platform-detection.log"
safe_delete "verification-output.log"

# Delete temp JSON files
safe_delete "techstars-with-cname-detection-temp.json"
safe_delete "techstars-with-detected-platforms-temp.json"
safe_delete "techstars-with-trust-centers-temp.json"
safe_delete "techstars-70-manual-review.csv"
safe_delete "techstars-73-verified-results.json"
safe_delete "techstars-high-confidence.json"
safe_delete "techstars-improved-scan-results.json"
safe_delete "techstars-verified-results.json"
safe_delete "techstars-potential-new-platforms.json"

# Delete old/test scripts
safe_delete "check-techstars-auto-pr.js"
safe_delete "check-techstars-platforms-from-verified.js"
safe_delete "find-trust-centers-improved.js"
safe_delete "generate-techstars-auto-pr-csv.js"
safe_delete "generate-techstars-csv.js"
safe_delete "generate-techstars-trust-centers-csv.js"
safe_delete "techstars-70-for-review.js"
safe_delete "test-subdomain-discovery.js"
safe_delete "verify-73-companies.js"
safe_delete "verify-high-confidence.js"
safe_delete "verify-trust-subdomains.js"
safe_delete "detect-platforms-for-all-techstars.js"

# Delete intermediate CSVs (keep only final results)
safe_delete "techstars-companies.csv"
safe_delete "techstars-trust-subdomains-verified.csv"
safe_delete "techstars-with-trust-centers.csv"
safe_delete "techstars-trust-subdomains-verified.json"

# Delete raw data (keep only simplified)
safe_delete "techstars-companies-raw.json"

cd ..

# ============================================
# A16Z-SPEEDRUN CLEANUP
# ============================================
echo ""
echo "📁 Cleaning a16z-speedrun folder..."

cd a16z-speedrun/

# Delete logs
safe_delete "delve-scan.log"
safe_delete "delve-scan-corrected.log"
safe_delete "delve-scan-fixed.log"
safe_delete "delve-scan-FINAL.log"
safe_delete "a16z-speedrun-scan.log"
safe_delete "verify-trust-centers.log"

# Delete temp/test JSON files
safe_delete "a16z-speedrun-companies-partial.json"
safe_delete "a16z-speedrun-companies-raw.json"
safe_delete "a16z-speedrun-delve-companies.json"
safe_delete "a16z-speedrun-delve-replacements.json"
safe_delete "a16z-speedrun-delve-trust-centers.json"
safe_delete "a16z-speedrun-delve-verified.json"
safe_delete "a16z-speedrun-high-confidence.json"
safe_delete "a16z-speedrun-verified-trust-centers.json"
safe_delete "a16z-speedrun-verified.json"
safe_delete "a16z-speedrun-with-trust-centers-updated.json"
safe_delete "a16z-speedrun-with-trust-centers.json"
safe_delete "a16z-speedrun-potential-new-platforms.json"

# Delete test/check scripts
safe_delete "check-a16z-stats.js"
safe_delete "check-delve-trust-centers.js"
safe_delete "check-detected-platforms.js"
safe_delete "check-known-platforms.js"
safe_delete "recount-platforms.js"
safe_delete "test-delve-detection.js"
safe_delete "test-delve-detection-v2.js"
safe_delete "test-delve-detection-v3.js"
safe_delete "test-delve-detection-final.js"
safe_delete "verify-a16z-companies.js"
safe_delete "verify-delve-content.js"
safe_delete "verify-delve-urls.js"
safe_delete "verify-non-delve-trust-centers.js"
safe_delete "re-scan-for-delve.js"

# Delete CSVs (keep only final auto-PR candidates)
safe_delete "a16z-speedrun-manual-review.csv"
safe_delete "a16z-speedrun-with-detected-platforms.csv"

cd ..

# ============================================
# SEQUOIA CLEANUP
# ============================================
echo ""
echo "📁 Cleaning Sequoia folder..."

cd sequoia/

# Delete raw/debug data
safe_delete "sequoia-companies-raw.json"
safe_delete "sequoia-response-raw.json"

cd ..

# ============================================
# ROOT SCRIPTS CLEANUP
# ============================================
echo ""
echo "📁 Cleaning root scripts folder..."

safe_delete "compare-a16z-vs-techstars.js"
safe_delete "compare-a16z-vs-techstars-v2.js"
safe_delete "auto-pr-candidates.json"

cd ..

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "   - Removed all .log files"
echo "   - Removed all temp/test JSON files"
echo "   - Removed all test/verification scripts"
echo "   - Removed intermediate CSVs"
echo "   - Kept production scripts and final data"
echo ""

