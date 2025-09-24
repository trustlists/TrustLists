# Getting Started with TrustList

This guide will help you set up your TrustList website similar to ChainList but for company trust centers.

## 🚀 Quick Setup

### 1. Initialize the Repository

```bash
# Create a new repository on GitHub named 'trustlist'
# Clone it locally
git clone https://github.com/yourusername/trustlist.git
cd trustlist

# Copy all files from this directory to your repository
# Then initialize
npm install
```

### 2. Update Configuration

Edit the following files with your information:

**`package.json`**: Update repository URL and homepage
```json
{
  "homepage": "https://yourusername.github.io/trustlist",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/trustlist.git"
  }
}
```

**`next.config.js`**: Update basePath and assetPrefix
```javascript
basePath: process.env.NODE_ENV === 'production' ? '/trustlist' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/trustlist/' : '',
```

### 3. Set Up GitHub Pages

1. Go to your repository settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"
4. The deploy workflow will automatically trigger on pushes to main

### 4. Customize Your Site

**Update branding**: 
- Replace "TrustList" with your desired name in all files
- Update colors in `tailwind.config.js`
- Add your logo to `public/` directory

**Add your domain** (optional):
- Create a `CNAME` file in `public/` with your domain
- Update the `homepage` in `package.json`

## 🎯 Adding Trust Centers

### Method 1: Using the Web Interface
1. Visit your site at `/submit`
2. Fill out the form
3. Copy the generated code
4. Create a PR with the new file

### Method 2: Manual Creation
1. Create a new file in `constants/trustCenterRegistry/company-name.js`
2. Use the template from existing files
3. Update `utils/trustCenters.js` to import the new file
4. Submit a PR

## 📝 Content Management

### Adding New Companies
Each company should have a file in `constants/trustCenterRegistry/` following this pattern:
- Filename: `company-slug.js`
- Content: Export default object with company data

### Required Fields
- `name`: Company name
- `slug`: URL-friendly identifier
- `website`: Company website
- `trustCenter`: Link to trust center/security page
- `industry`: Industry category
- `description`: Brief description

### Optional Fields
- `logo`: Logo identifier
- `founded`: Year founded
- `headquarters`: Location
- `employees`: Company size
- `certifications`: Array of certifications
- `frameworks`: Array of compliance frameworks
- `documents`: Array of document links
- `contact`: Contact information object

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate JSON data
npm run generate

# Deploy to GitHub Pages
npm run deploy
```

## 🌐 API Endpoints

Your site will automatically provide these APIs:

- `/api/trust-centers` - All trust centers data
- `/api/stats` - Statistics about the database
- `/api` - API documentation

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics
- GitHub repository insights
- API usage monitoring

## 🤝 Community Guidelines

1. **Quality**: Only add companies with publicly accessible trust centers
2. **Accuracy**: Verify all information before submission
3. **Maintenance**: Keep information up-to-date
4. **Respectful**: Follow community guidelines for discussions

## 🛠️ Customization Ideas

### Visual Themes
- Dark mode toggle
- Custom color schemes
- Company logos and branding

### Features
- Advanced filtering
- Company comparison tool
- Certification tracking
- RSS feeds for updates

### Integrations
- Slack/Discord notifications for new submissions
- Email alerts for company updates
- Third-party security data integration

## 🚨 Important Notes

1. **GitHub Pages Limitations**: 
   - Static hosting only
   - No server-side processing
   - Limited to public repositories (for free accounts)

2. **Performance**: 
   - Keep JSON files under 1MB for best performance
   - Optimize images and assets
   - Use CDN for better global performance

3. **Security**: 
   - Never commit sensitive information
   - Validate all external URLs
   - Monitor for malicious submissions

## 📞 Support

- Create issues on GitHub for bugs
- Use discussions for feature requests
- Join the community for help and sharing

---

**Happy Building! 🎉**

Your TrustList will help companies discover trusted partners and help the community make informed security decisions.
