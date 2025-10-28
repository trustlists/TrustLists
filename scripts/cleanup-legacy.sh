#!/bin/bash

echo "🧹 Cleaning up legacy and redundant scripts..."
echo ""

# trust-center-discovery/ cleanup
echo "📁 Cleaning trust-center-discovery/..."
cd /Users/michael/Desktop/Trustlist/scripts/trust-center-discovery

# Delete redundant scripts
rm -v full-discovery.js
rm -v trust-center-scraper.js
rm -v vendor-detect.js
rm -v generate-platform-summary.js
rm -v merge-vendors.js
rm -v fix-quote-keys.js
rm -v create-registry-from-json.js

# Delete old result files
rm -v trust-center-discovery-results.csv
rm -v trust-center-discovery-results.json
rm -v trust-centers-ready-to-add.json

# Delete old data folder
rm -rfv data/

echo ""
echo "✅ trust-center-discovery/ cleaned!"
echo "   Kept: incremental-discovery.js, yc-companies-cache.json, last-discovery-run.json"
echo ""

# utilities/ cleanup
echo "📁 Cleaning utilities/..."
cd /Users/michael/Desktop/Trustlist/scripts/utilities

# Delete duplicate platform detection
rm -v detect-platform.js

# Delete GitHub Actions scripts (if not using automation)
# Uncomment these if you're not using GitHub Actions:
# rm -v create-pr.js
# rm -v process-high-confidence.js

# Delete one-time cleanup script
rm -v remove-descriptions.js

echo ""
echo "✅ utilities/ cleaned!"
echo "   Kept: add-platform-tags.js, json-to-csv.js"
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Cleanup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Final Structure:"
echo ""
echo "trust-center-discovery/ (YC automation)"
echo "  ✅ incremental-discovery.js    - Active YC monthly automation"
echo "  ✅ yc-companies-cache.json     - Cache for incremental updates"
echo "  ✅ last-discovery-run.json     - Tracks last run"
echo "  ✅ README.md                   - Documentation"
echo ""
echo "utilities/"
echo "  ✅ add-platform-tags.js        - Add platform tags to registry"
echo "  ✅ json-to-csv.js              - Convert JSON to CSV"
echo "  ⚠️  create-pr.js               - GitHub Actions (optional)"
echo "  ⚠️  process-high-confidence.js - GitHub Actions (optional)"
echo ""
echo "sources/ (New structure)"
echo "  ✅ y-combinator/               - YC companies"
echo "  ✅ techstars/                  - Techstars companies"
echo "  ✅ a16z-speedrun/              - a16z companies"
echo "  ✅ sequoia/                    - Sequoia companies"
echo ""
echo "shared/ (Universal utilities)"
echo "  ✅ discover-trust-centers.js   - Universal discovery"
echo "  ✅ detect-platforms.js         - Universal platform detection"
echo ""

