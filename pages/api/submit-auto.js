// API Route for Auto-Submission (Server-side GitHub API call)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { company } = req.body;

    // Validate the company data
    if (!company || !company.name || !company.website || !company.trustCenter || !company.description) {
      res.status(400).json({ error: 'Missing required company information' });
      return;
    }

    // Get GitHub token from environment
    const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    if (!githubToken) {
      console.error('GitHub token not found in environment');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    // Call GitHub API to trigger repository_dispatch
    const response = await fetch('https://api.github.com/repos/FelixMichaels/TrustLists/dispatches', {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'TrustList-AutoSubmit/1.0'
      },
      body: JSON.stringify({
        event_type: 'trust-center-submission',
        client_payload: {
          company: company
        }
      })
    });

    if (response.ok) {
      res.status(200).json({ 
        success: true, 
        message: 'Submission successful! Pull request will be created automatically.' 
      });
    } else {
      const errorText = await response.text();
      console.error('GitHub API error:', response.status, errorText);
      res.status(response.status).json({ 
        error: 'GitHub API error', 
        details: errorText,
        status: response.status
      });
    }
  } catch (error) {
    console.error('Auto-submission error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
