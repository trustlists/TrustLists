# TrustLists

A comprehensive directory of company trust centers and compliance documentation.

## 🌐 Live Sites

- **Main Directory**: [trustlists.org](https://trustlists.org)
- **API Documentation**: [docs.trustlists.org](https://docs.trustlists.org)

## 📊 Stats

- **400+** company trust centers
- **Automated discovery** from YC companies  
- **RESTful API** with no authentication required
- **Platform detection** using CNAME resolution

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/FelixMichaels/TrustLists.git
cd TrustLists

# Install dependencies
npm install

# Run locally
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the site.

## 🤝 Contributing

See our [contributing guide](https://docs.trustlists.org/contributing/guidelines) for detailed instructions on:

- Adding new trust centers
- Reporting issues
- Development setup
- Code standards

### Quick Submission

**Option 1**: Use our [submission form](https://trustlists.org/submit)  
**Option 2**: Add a file to `constants/trustCenterRegistry/`

```javascript
export default {
  "name": "Example Corp",
  "website": "https://example.com",
  "trustCenter": "https://trust.example.com",
  "platform": "Self-hosted", // Auto-detected if omitted
  "iconUrl": "https://www.google.com/s2/favicons?domain=example.com&sz=128"
};
```

## 🏗️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with static site generation
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[GitHub Pages](https://pages.github.com/)** - Static site hosting
- **[Mintlify](https://mintlify.com/)** - Documentation platform

## 📝 License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Inspired by [ChainList](https://chainlist.org/) by DeFiLlama
- Built for the compliance and security community