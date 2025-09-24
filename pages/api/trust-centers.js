import { getAllTrustCenters, searchTrustCenters } from '../../utils/trustCenters';

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
    const { search, industry, certification, framework, companySize } = req.query;

    let trustCenters;

    if (search || industry || certification || framework || companySize) {
      // Apply search and filters
      const filters = {
        industry: industry || 'all',
        certification: certification || 'all',
        framework: framework || 'all',
        companySize: companySize || 'all'
      };
      
      trustCenters = searchTrustCenters(search || '', filters);
    } else {
      // Return all trust centers
      trustCenters = getAllTrustCenters();
    }

    // Add metadata
    const response = {
      data: trustCenters,
      meta: {
        total: trustCenters.length,
        generated: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch trust centers'
    });
  }
}
