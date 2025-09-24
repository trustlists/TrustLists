# TrustList

A curated directory of company trust centers and compliance documentation. TrustList is a professional tool that helps users easily discover and access security, privacy, and compliance information from trusted organizations.

## 🚀 Features

- **🏢 Curated Trust Center Directory**: Browse verified company trust centers with logos and descriptions
- **🔍 Smart Search**: Find companies by name or description with instant results
- **🌙 Dark Mode**: Professional dark/light theme toggle with preference persistence
- **📱 Fixed Sidebar Navigation**: Always-accessible navigation with smooth scrolling content
- **⚡ Quick Actions**: Visit websites, copy trust center URLs, report issues via GitHub
- **📋 GitHub Issues Integration**: Professional issue reporting with structured templates
- **🎨 Professional Notifications**: In-app notifications instead of system popups
- **🤝 Community-Driven**: Simple PR workflow for adding new companies
- **📱 Responsive Design**: Perfect experience on desktop and mobile

## 🏗️ Built With

- [Next.js 14](https://nextjs.org/) - React framework with static site generation
- [Tailwind CSS](https://tailwindcss.com/) - Modern utility-first CSS framework
- [GitHub Pages](https://pages.github.com/) - Free static site hosting
- [Heroicons](https://heroicons.com/) - Professional SVG icons

## 🤝 Contributing

### Add a Trust Center

We use a **simplified submission process** to keep TrustList clean and focused. You can either:

1. **Use our submission form**: Visit [trustlists.github.io/submit](https://felixmichaels.github.io/TrustLists/submit/) for a guided experience
2. **Submit directly**: Add a new file to `constants/trustCenterRegistry/` folder

**File Structure** (only 5 fields required):
```javascript
export default {
  "name": "Example Corp",
  "website": "https://example.com",
  "trustCenter": "https://trust.example.com",
  "description": "Leading technology company with comprehensive security practices",
  "iconUrl": "https://example.com/logo.png"
};
```

**Requirements:**
- Company name and description
- Working website and trust center URLs  
- Direct link to company logo (PNG, JPG, or SVG)
- File named: `{company-name-lowercase}.js`

### Report Issues

Found a problem with a company listing? Use the **Report Issue** button on any company card, which will open a structured GitHub Issue with pre-filled templates.

## 📊 API

**Free JSON API** available via GitHub Pages:

### Endpoints

```bash
# All trust centers (live data)
GET https://felixmichaels.github.io/TrustLists/trust-centers.json

# Statistics
GET https://felixmichaels.github.io/TrustLists/api/stats
```

### Example Response
```json
[
  {
    "name": "Stripe",
    "website": "https://stripe.com",
    "trustCenter": "https://stripe.com/privacy-center/legal",
    "description": "Online payment processing platform with comprehensive security and compliance programs",
    "iconUrl": "https://stripe.com/img/v3/home/social.png"
  }
]
```

### Usage Examples
```javascript
// Fetch all companies
const companies = await fetch('https://felixmichaels.github.io/TrustLists/trust-centers.json')
  .then(res => res.json());

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
