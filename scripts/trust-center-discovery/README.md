# Trust Center Discovery

This folder contains scripts for discovering trust centers from YC companies using their official API.

## Folder Structure

```
scripts/trust-center-discovery/
├─ full-discovery.js              # Full run over all companies
├─ incremental-discovery.js       # Weekly incremental run (recommended)
├─ trust-center-scraper.js        # Core logic used by the runners
├─ data/                          # All outputs/artifacts live here
│  ├─ last-discovery-run.json
│  ├─ trust-center-discovery-results.json
│  ├─ trust-center-discovery-results.csv
│  ├─ trust-center-discovery-results.with-vendors.json
│  ├─ trust-center-discovery-results - trust.domains.csv
│  ├─ trust-centers-ready-to-add.json
│  ├─ yc-api-test-results.json
│  ├─ yc-companies-cache.json
│  ├─ yc-companies-full.json
│  └─ yc-companies-raw.json
└─ README.md
```

## Files

- `yc-api-test.js` - Test script to verify YC API access
- `trust-center-scraper.js` - Original scraper for discovering trust centers
- `full-discovery.js` - Full discovery script (tests all companies)
- `incremental-discovery.js` - **RECOMMENDED** - Incremental discovery for weekly runs
- `yc-api-test-results.json` - Sample API response data
- `yc-companies-full.json` - Full list of YC companies (when fetched)

## Usage

### 1. Test YC API
```bash
node yc-api-test.js
```

### 2. Full Discovery (First Run)
```bash
node full-discovery.js
```

### 3. Incremental Discovery (Weekly Runs) - **RECOMMENDED**
```bash
node incremental-discovery.js
```

### 4. Full Refresh (Reset Cache)
```bash
node incremental-discovery.js --full-refresh
```

## Output Files

All outputs are written to `scripts/trust-center-discovery/data/`:
- `yc-companies-cache.json` - Cached YC companies for incremental updates
- `last-discovery-run.json` - Track last run timestamp and stats
- `trust-center-discovery-results.json` - Detailed discovery results
- `trust-center-discovery-results.csv` - CSV format for easy review
- `trust-center-discovery-results.with-vendors.json` - Results augmented with vendor detection
- `trust-center-discovery-results - trust.domains.csv` - Compact list of trust.* domains (with vendor/CNAME columns)
- `trust-centers-ready-to-add.json` - Copy-paste ready trust centers

## Incremental Discovery Benefits

### ⚡ **Speed**
- **First run**: ~5-10 minutes (fetches all 5,475 companies)
- **Weekly runs**: ~1-2 minutes (only tests new companies)
- **95% faster** for subsequent runs

### 🎯 **Efficiency**
- **Only tests new companies** added since last run
- **Maintains cache** of all YC companies
- **Tracks run history** and statistics

### 🔄 **Smart Updates**
- **Detects new companies** by comparing company IDs
- **Updates cache** automatically
- **Skips companies** already in TrustList database

## Features

- ✅ Uses official YC API (no web scraping)
- ✅ Filters out existing companies from TrustList database
- ✅ Tests multiple trust center URL patterns
- ✅ Generates copy-paste ready JavaScript objects
- ✅ Respectful rate limiting
- ✅ Comprehensive reporting
 - ✅ Optional vendor detection (e.g., Oneleet via CNAME) to confirm hosted trust centers

## Trust Center URL Patterns Tested

- `trust.{domain}`
- `trustcenter.{domain}`
- `security.{domain}`
- `compliance.{domain}`
- `privacy.{domain}`
- `{domain}/trust`
- `{domain}/security`
- `{domain}/compliance`
- `{domain}/privacy`
- `{domain}/trust-center`
- `{domain}/security-center`
