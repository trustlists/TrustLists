const fs = require('fs');
const path = require('path');

// Read the trust-centers.json file
const jsonPath = path.join(__dirname, '../../public/trust-centers.json');
const csvPath = path.join(__dirname, '../../public/trust-centers.csv');

try {
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Extract the data array
  const companies = jsonData.data;
  
  // Create CSV header
  const headers = ['name', 'website', 'trustCenter', 'platform', 'iconUrl'];
  
  // Convert to CSV
  const csvRows = [headers.join(',')];
  
  companies.forEach(company => {
    const row = headers.map(header => {
      // Escape quotes and wrap in quotes if contains comma
      let value = company[header] || '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        value = '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    });
    csvRows.push(row.join(','));
  });
  
  // Write CSV file
  fs.writeFileSync(csvPath, csvRows.join('\n'));
  
  console.log(`✅ CSV file created: ${csvPath}`);
  console.log(`📊 Total companies: ${companies.length}`);
  console.log(`📁 File size: ${(fs.statSync(csvPath).size / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('❌ Error converting JSON to CSV:', error.message);
  process.exit(1);
}
