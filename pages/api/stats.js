import { getStats, getUniqueIndustries, getUniqueCertifications, getAllTrustCenters } from '../../utils/trustCenters';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const stats = getStats();
    const industries = getUniqueIndustries();
    const certifications = getUniqueCertifications();

    const response = {
      ...stats,
      industries: industries.map(industry => ({
        name: industry,
        count: getAllTrustCenters().filter(tc => tc.industry === industry).length
      })),
      certifications: certifications.map(cert => ({
        name: cert,
        count: getAllTrustCenters().filter(tc => tc.certifications.includes(cert)).length
      })).sort((a, b) => b.count - a.count),
      generated: new Date().toISOString()
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch statistics'
    });
  }
}
