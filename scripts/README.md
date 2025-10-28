# Trust Center Discovery Scripts

This directory contains scripts for discovering and analyzing trust centers from various company sources.

## 📁 Structure

```
scripts/
├── sources/           # Company-specific data fetchers
│   ├── y-combinator/
│   │   ├── fetch.js          # Fetch Y Combinator companies
│   │   └── companies.json    # Company list
│   ├── techstars/
│   │   ├── fetch.js          # Fetch Techstars companies
│   │   └── companies.json    # Company list
│   ├── a16z-speedrun/
│   │   ├── fetch.js          # Fetch a16z Speedrun companies
│   │   └── companies.json    # Company list
│   └── sequoia/
│       ├── fetch.js          # Fetch Sequoia companies
│       └── companies.json    # Company list
│
└── shared/            # Universal utilities (work with any source)
    ├── discover-trust-centers.js   # Find trust centers
    └── detect-platforms.js         # Detect hosting platforms
```

## 🚀 Usage

### 1. Fetch Companies from a Source

```bash
# Y Combinator
cd sources/y-combinator && node fetch.js

# Techstars
cd sources/techstars && node fetch.js

# a16z Speedrun
cd sources/a16z-speedrun && node fetch.js

# Sequoia
cd sources/sequoia && node fetch.js
```

### 2. Discover Trust Centers

```bash
# Using the universal discovery script
node shared/discover-trust-centers.js sources/y-combinator/companies.json sources/y-combinator/trust-centers.json
```

### 3. Detect Platforms

```bash
# Using the universal platform detection script
node shared/detect-platforms.js sources/y-combinator/trust-centers.json sources/y-combinator/platforms.json
```

## 📊 Complete Workflow Example

```bash
# Step 1: Fetch companies
cd sources/y-combinator
node fetch.js
cd ../..

# Step 2: Discover trust centers
node shared/discover-trust-centers.js \
  sources/y-combinator/companies.json \
  sources/y-combinator/trust-centers.json

# Step 3: Detect platforms
node shared/detect-platforms.js \
  sources/y-combinator/trust-centers.json \
  sources/y-combinator/platforms.json
```

## 🔧 Adding a New Source

1. Create a new folder in `sources/`
2. Add a `fetch.js` script that outputs to `companies.json`
3. Use the shared scripts for discovery and detection

Example:
```bash
mkdir sources/new-source
# Create fetch.js that outputs companies.json
node shared/discover-trust-centers.js sources/new-source/companies.json sources/new-source/trust-centers.json
node shared/detect-platforms.js sources/new-source/trust-centers.json sources/new-source/platforms.json
```

## 📝 Notes

- All shared scripts work with any company list format (as long as it has `name` and `website` fields)
- Progress is saved automatically every 50 companies
- CNAME detection is tried first (faster), then HTML analysis
- Results include platform, detection method, and confidence scores
