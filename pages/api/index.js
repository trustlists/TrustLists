import { getStats, getUniqueIndustries, getUniqueCertifications, getUniqueFrameworks } from '../../utils/trustCenters';

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
    const frameworks = getUniqueFrameworks();

    const apiInfo = {
      name: 'TrustList API',
      version: '1.0.0',
      description: 'API for accessing company trust center information',
      endpoints: {
        '/api/trust-centers': {
          method: 'GET',
          description: 'Get all trust centers or search/filter them',
          parameters: {
            search: 'Search query (optional)',
            industry: 'Filter by industry (optional)',
            certification: 'Filter by certification (optional)',
            framework: 'Filter by framework (optional)',
            companySize: 'Filter by company size (optional)'
          }
        },
        '/api/stats': {
          method: 'GET',
          description: 'Get statistics about the trust center database'
        }
      },
      stats,
      filters: {
        industries,
        certifications,
        frameworks
      },
      generated: new Date().toISOString()
    };

    res.status(200).json(apiInfo);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch API information'
    });
  }
}
