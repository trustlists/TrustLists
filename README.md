# TrustList

A curated list of company trust centers and compliance documentation. TrustList helps users discover and connect to trusted companies by providing easy access to their security, privacy, and compliance information.

## 🚀 Features

- **Comprehensive Trust Center Directory**: Browse companies and their trust centers
- **Advanced Search & Filtering**: Find companies by industry, certifications, or compliance frameworks
- **Community-Driven**: Submit PRs to add new trust centers
- **Responsive Design**: Works seamlessly on desktop and mobile
- **API Access**: Programmatic access to all trust center data

## 🏗️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [GitHub Pages](https://pages.github.com/) - Static site hosting
- [Fuse.js](https://fusejs.io/) - Fuzzy search library

## 🤝 Contributing

### Add a Trust Center

Submit a PR that adds a new file to the `constants/trustCenterRegistry` folder. The new file should be named `{company-slug}.js` and follow this structure:

```javascript
{
  "name": "Example Corp",
  "slug": "example-corp",
  "website": "https://example.com",
  "trustCenter": "https://trust.example.com",
  "industry": "Technology",
  "description": "Leading technology company with comprehensive security practices",
  "logo": "example-corp",
  "founded": 2010,
  "headquarters": "San Francisco, CA",
  "employees": "1000-5000",
  "certifications": [
    "SOC 2 Type II",
    "ISO 27001",
    "GDPR Compliant",
    "HIPAA Compliant"
  ],
  "frameworks": [
    "NIST Cybersecurity Framework",
    "ISO 27001",
    "SOC 2"
  ],
  "documents": [
    {
      "name": "Security Overview",
      "url": "https://trust.example.com/security",
      "type": "security"
    },
    {
      "name": "Privacy Policy",
      "url": "https://example.com/privacy",
      "type": "privacy"
    }
  ],
  "contact": {
    "security": "security@example.com",
    "privacy": "privacy@example.com",
    "compliance": "compliance@example.com"
  }
}
```

### Add Additional Information

If you wish to add more information about an existing company, please submit a PR modifying the appropriate file in the `constants/trustCenterRegistry` folder.

## 📊 API

The following API returns all trust center data:

`https://trustlist.org/api/trust-centers.json`

## 🚀 Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## 📝 License

This project is licensed under the GPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- Inspired by [ChainList](https://chainlist.org/) by DeFiLlama
- Built for the compliance and security community
