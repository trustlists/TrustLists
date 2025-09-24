import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllTrustCenters, searchTrustCenters, getStats } from '../utils/trustCenters';

export default function Home({ trustCenters, stats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeTestnets, setIncludeTestnets] = useState(false);

  const filteredTrustCenters = useMemo(() => {
    return searchTrustCenters(searchQuery, {});
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>TrustList</title>
        <meta name="description" content="TrustList is a list of company trust centers. Users can use the information to connect to trusted companies and their compliance documentation." />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">TrustList</h1>
                <p className="text-gray-600 hidden md:block">Helping users connect to trusted companies</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Submit Trust Center
                </Link>
                <Link href="/api" className="text-gray-600 hover:text-blue-600">API</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Header Text */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-lg text-gray-700 mb-8">
            <strong>TrustList is a list of company trust centers.</strong> Users can use the information to connect to trusted companies and access their security, privacy, and compliance documentation.
          </h2>

          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search Companies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeTestnets}
                  onChange={(e) => setIncludeTestnets(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-gray-600">Include Small Companies</span>
              </label>
            </div>
          </div>

          {/* Company List */}
          <div className="space-y-4">
            {filteredTrustCenters.map((company) => (
              <div
                key={company.slug}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Industry: {company.industry}</span>
                        <span>|</span>
                        <span>Employees: {company.employees}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <a
                      href={company.trustCenter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Trust Center
                    </a>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Website
                    </a>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {company.certifications.length} Certifications
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.certifications.slice(0, 2).join(', ')}
                        {company.certifications.length > 2 && '...'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTrustCenters.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">No companies found. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const trustCenters = getAllTrustCenters();
  const stats = getStats();

  return {
    props: {
      trustCenters,
      stats,
    },
  };
}
