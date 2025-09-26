# TrustList

A curated directory of company trust centers and compliance documentation. Easily discover and access security, privacy, and compliance information from trusted organizations.

## 🌐 Live Site

**Visit:** [https://trustlists.org](https://trustlists.org)

## 🏗️ Built With

- [Next.js 14](https://nextjs.org/) - React framework with static site generation
- [Tailwind CSS](https://tailwindcss.com/) - Modern utility-first CSS framework
- [GitHub Pages](https://pages.github.com/) - Free static site hosting

## 🤝 Contributing

### Add a Trust Center

**Simplified submission process** - just 4 fields required:

1. **Use our submission form**: Visit [trustlists.org/submit](https://trustlists.org/submit/) for a guided experience
2. **Submit directly**: Add a new file to `constants/trustCenterRegistry/` folder

**File Structure:**
```javascript
export default {
  "name": "Example Corp",
  "website": "https://example.com",
  "trustCenter": "https://trust.example.com", 
  "description": "Leading technology company with comprehensive security practices",
  "iconUrl": "https://www.google.com/s2/favicons?domain=example.com&sz=128"
};
```

**Requirements:**
- Company name and description
- Working website and trust center URLs  
- Logo automatically generated from website domain
- File named: `{company-name-lowercase}.js`

### Report Issues

Found a problem with a company listing? Use the **Report Issue** button on any company card to open a structured GitHub Issue.

## 📊 API

**Free JSON API** available:

### Endpoints

```bash
# All trust centers (live data)
GET https://trustlists.org/trust-centers.json

# Statistics  
GET https://trustlists.org/api/stats
```

### Example Response
```json
{
  "data": [
    {
      "name": "Stripe",
      "website": "https://stripe.com",
      "trustCenter": "https://stripe.com/privacy-center/legal",
      "description": "Online payment processing platform with comprehensive security and compliance programs",
      "iconUrl": "https://www.google.com/s2/favicons?domain=stripe.com&sz=128"
    }
  ],
  "meta": {
    "total": 54,
    "generated": "2025-01-25T10:30:00.000Z",
    "version": "1.0.0"
  }
}
```

### Usage Examples
```javascript
// Fetch all companies
const response = await fetch('https://trustlists.org/trust-centers.json')
  .then(res => res.json());
const companies = response.data;

// Find specific company
const stripe = companies.find(c => c.name === 'Stripe');
```

**Features:**
- ✅ **Free** - No API keys or rate limits
- ✅ **Always up-to-date** - Rebuilds automatically on data changes
- ✅ **CORS enabled** - Use from any website
- ✅ **Fast** - Served via GitHub's global CDN

## 🚀 Development

```bash
# Clone the repository
git clone https://github.com/FelixMichaels/TrustLists.git
cd TrustLists

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build and Deploy
```bash
# Build for production
npm run build

# Generate static files for GitHub Pages
npm run export

# Deploy to GitHub Pages (automatic via GitHub Actions)
git push origin main
```

## 📝 License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Inspired by [ChainList](https://chainlist.org/) by DeFiLlama
- Built for the compliance and security community