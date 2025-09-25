# Add Trust Center

## Company Information *(Optional - for review reference only)*
> 💡 **You don't need to fill this out!** Just create the `.js` file below and check the boxes. This section helps reviewers quickly understand your submission.

- **Company Name**: [Company Name]
- **Website**: [Company website URL]
- **Trust Center URL**: [Trust center URL]
- **Description**: [Brief description]
- **Logo URL**: [Direct URL to company logo]

## Checklist *(Please check all boxes before submitting)*
- [ ] Trust center URL is publicly accessible
- [ ] Company logo URL is direct link to image (PNG, JPG, or SVG)
- [ ] Information is accurate and up-to-date
- [ ] File placed in `constants/trustCenterRegistry/[company-name].js`
- [ ] File follows the required structure (5 fields only)

## File Structure *(This is what you need to create)*
Create a file in `constants/trustCenterRegistry/[company-name].js` with this exact structure:

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
**📋 Summary**: Create the `.js` file above ✅ Check all boxes ✅ Submit PR! The "Company Information" section is optional.
