# Scripts

This directory contains utility scripts and the Trust Center discovery tooling.

## Structure

```
scripts/
├─ utilities/                      # General-purpose project scripts
│  ├─ add-platform-tags.js
│  ├─ detect-platform.js
│  └─ remove-descriptions.js
└─ trust-center-discovery/         # Trust Center discovery
   ├─ full-discovery.js            # Full run over all YC companies
   ├─ incremental-discovery.js     # Weekly incremental run (recommended)
   ├─ trust-center-scraper.js      # Core discovery logic
   ├─ data/                        # Outputs/artifacts
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

## Usage

From the repo root:

### Full discovery (initial run)
```bash
node scripts/trust-center-discovery/full-discovery.js
```

### Incremental discovery (weekly)
```bash
node scripts/trust-center-discovery/incremental-discovery.js
```

### Full refresh (reset cache)
```bash
node scripts/trust-center-discovery/incremental-discovery.js --full-refresh
```

Outputs will be written under `scripts/trust-center-discovery/data/`.


