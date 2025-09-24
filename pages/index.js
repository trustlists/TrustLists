import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllTrustCenters, searchTrustCenters, getStats } from '../utils/trustCenters';

export default function Home({ trustCenters, stats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeSmallCompanies, setIncludeSmallCompanies] = useState(false);

  const filteredTrustCenters = useMemo(() => {
    return searchTrustCenters(searchQuery, {});
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>TrustList</title>
        <meta name="description" content="TrustList is a list of company trust centers. Users can use the information to connect to trusted companies and their compliance documentation." />
      </Head>

      <div className="min-h-screen bg-gray-100 flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white shadow-sm p-6 flex-shrink-0">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TrustList</h1>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Helping users connect to trusted companies
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              TrustList is a list of company trust centers. Users can use the information to connect 
              to trusted companies and access their security, privacy, and compliance documentation.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Link 
              href="/submit" 
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <span>+</span>
              <span>Add Your Trust Center</span>
            </Link>
            <Link 
              href="/submit" 
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <span>+</span>
              <span>Add Your Company</span>
            </Link>
          </div>

          {/* Links */}
          <div className="space-y-3 mb-8">
            <a href="https://github.com/FelixMichaels/trustlists" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span>📄</span>
              <span>View Code</span>
            </a>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span>🌙</span>
              <span>Toggle Theme</span>
            </button>
            <Link href="/api" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <span>⚡</span>
              <span>API</span>
            </Link>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search Companies"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <button className="px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Connect Wallet
                </button>
              </div>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeSmallCompanies}
                  onChange={(e) => setIncludeSmallCompanies(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-gray-600">Include Small Companies</span>
              </label>
            </div>
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTrustCenters.map((company, index) => (
              <div
                key={company.name + index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">Company</span>
                    <div className="font-medium text-gray-900">{company.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <div className="font-medium text-gray-900">Active</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={company.trustCenter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Trust Center
                  </a>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
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
