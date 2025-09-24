# Add Trust Center

## Company Information
- **Company Name**: [Company Name]
- **Trust Center URL**: [URL]
- **Description**: [Brief description]

## Checklist
- [ ] Trust center URL is publicly accessible
- [ ] Information is accurate and up-to-date
- [ ] File placed in `constants/trustCenterRegistry/[company-name].js`
- [ ] File follows the required structure (4 fields only)

## File Structure
```javascript
export default {
  "name": "Company Name",
  "trustCenter": "https://company.com/trust",
  "description": "Brief description of the company",
  "icon": "company-name"
};
```

---
**Note**: Keep it simple! Only 4 fields required.
