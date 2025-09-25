import Head from 'next/head';
import Header from '../components/Header';
import { CodeBracketIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function APIPage() {
  const endpoints = [
    {
      path: '/api/trust-centers',
      method: 'GET',
      description: 'Get all trust centers or search/filter them',
      parameters: [
        { name: 'search', type: 'string', description: 'Search query (optional)' },
        { name: 'industry', type: 'string', description: 'Filter by industry (optional)' },
        { name: 'certification', type: 'string', description: 'Filter by certification (optional)' },
        { name: 'framework', type: 'string', description: 'Filter by framework (optional)' },
        { name: 'companySize', type: 'string', description: 'Filter by company size (optional)' }
      ],
      example: '/api/trust-centers?search=stripe&industry=Financial%20Technology'
    },
    {
      path: '/api/stats',
      method: 'GET',
      description: 'Get statistics about the trust center database',
      parameters: [],
      example: '/api/stats'
    }
  ];

  const exampleResponse = {
    "data": [
      {
        "name": "Stripe",
        "slug": "stripe",
        "website": "https://stripe.com",
        "trustCenter": "https://stripe.com/privacy-center/legal",
        "industry": "Financial Technology",
        "description": "Online payment processing platform with comprehensive security and compliance programs",
        "certifications": ["PCI DSS Level 1", "SOC 2 Type II", "ISO 27001", "GDPR Compliant"],
        "frameworks": ["PCI DSS", "SOC 2", "ISO 27001", "NIST Cybersecurity Framework"],
        "contact": {
          "security": "security@stripe.com",
          "privacy": "privacy@stripe.com"
        }
      }
    ],
    "meta": {
      "total": 1,
      "generated": "2024-01-15T10:30:00.000Z",
      "version": "1.0.0"
    }
  };

  return (
    <>
      <Head>
        <title>API Documentation - TrustList</title>
        <meta name="description" content="API documentation for TrustList. Access company trust center data programmatically." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <CodeBracketIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access company trust center data programmatically with our RESTful API. 
              Free to use with no authentication required.
            </p>
          </div>

          {/* Quick Start */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>
            <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
              <div className="mb-2"># Get all trust centers</div>
              <div className="text-white">curl https://trustlists.org/api/trust-centers</div>
              <div className="mt-4 mb-2"># Search for companies</div>
              <div className="text-white">curl "https://trustlists.org/api/trust-centers?search=stripe"</div>
              <div className="mt-4 mb-2"># Filter by industry</div>
              <div className="text-white">curl "https://trustlists.org/api/trust-centers?industry=Financial%20Technology"</div>
            </div>
          </div>

          {/* Base URL */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Base URL</h3>
            <code className="text-blue-800 font-mono">https://trustlists.org/api</code>
          </div>

          {/* Endpoints */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="w-8 h-8 mr-3 text-primary-600" />
              Endpoints
            </h2>

            {endpoints.map((endpoint, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-3">
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{endpoint.path}</code>
                </div>
                
                <p className="text-gray-600 mb-6">{endpoint.description}</p>

                {endpoint.parameters.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {endpoint.parameters.map((param, paramIndex) => (
                            <tr key={paramIndex}>
                              <td className="px-4 py-3 text-sm font-mono text-gray-900">{param.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{param.type}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h4>
                  <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm">
                    GET {endpoint.example}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Try it</h4>
                  <a
                    href={`/api${endpoint.example}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Open in browser
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Example Response */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="w-8 h-8 mr-3 text-primary-600" />
              Example Response
            </h2>
            <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm overflow-x-auto">
              <pre>{JSON.stringify(exampleResponse, null, 2)}</pre>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Rate Limits</h3>
            <p className="text-yellow-800">
              Currently, there are no rate limits on the API. Please be respectful and don't abuse the service. 
              We reserve the right to implement rate limiting if necessary.
            </p>
          </div>

          {/* Support */}
          <div className="text-center mt-12 p-8 bg-gray-100 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Have questions about the API or want to report an issue?
            </p>
            <a
              href="https://github.com/FelixMichaels/TrustLists/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Open an Issue on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
