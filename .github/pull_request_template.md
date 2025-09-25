# Add Trust Center

## Company Information
- **Company Name**: [Company Name]
- **Website**: [Company website URL]
- **Trust Center URL**: [Trust center URL]
- **Description**: [Brief description]
- **Logo URL**: [Direct URL to company logo]

## Checklist
- [ ] Trust center URL is publicly accessible
- [ ] Company logo URL is direct link to image (PNG, JPG, or SVG)
- [ ] Information is accurate and up-to-date
- [ ] File placed in `constants/trustCenterRegistry/[company-name].js`
- [ ] File follows the required structure (5 fields only)

## File Structure
```javascript
export default {
  "name": "Company Name",
  "website": "https://company.com",
  "trustCenter": "https://company.com/trust",
  "description": "Brief description of the company",
  "iconUrl": "https://company.com/logo.png"
};
```

---
**Note**: Keep it simple! Only 5 fields required - name, website, trustCenter, description, and iconUrl.
