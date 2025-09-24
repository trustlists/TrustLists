import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllTrustCenters, searchTrustCenters, getStats } from '../utils/trustCenters';

export default function Home({ trustCenters, stats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [includeSmallCompanies, setIncludeSmallCompanies] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    setDarkMode(saved === 'true');
  }, []);

  // Save dark mode preference and apply to document
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredTrustCenters = useMemo(() => {
    return searchTrustCenters(searchQuery, {});
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>TrustList</title>
        <meta name="description" content="TrustList is a list of company trust centers. Users can use the information to connect to trusted companies and their compliance documentation." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="flex">
          {/* Left Sidebar - Fixed */}
          <div className="w-96 bg-white dark:bg-gray-800 min-h-screen shadow-sm">
            <div className="p-8">
              {/* Logo and Title */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TrustList</h1>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Helping users connect to trusted companies
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  TrustList is a list of company trust centers. Users can use the information to connect their wallets and Web3 middleware providers to the appropriate Company ID and Trust Center to connect to the correct company.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mb-8">
                <Link 
                  href="/submit" 
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center font-medium text-lg shadow-sm"
                >
                  <span className="mr-2 text-xl">+</span>
                  Add Your Trust Center
                </Link>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <a 
                  href="https://github.com/FelixMichaels/trustlists" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <span className="mr-3 text-xl">📄</span>
                  View Code
                </a>
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <span className="mr-3 text-xl">{darkMode ? '☀️' : '🌙'}</span>
                  Toggle Theme
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="mb-4">
                <div className="relative max-w-lg">
                  <input
                    type="text"
                    placeholder="Search Companies   Stripe, GitHub, Salesforce..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSmallCompanies}
                    onChange={(e) => setIncludeSmallCompanies(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300 text-lg">Include Small Companies</span>
                </label>
              </div>
            </div>

            {/* Company Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredTrustCenters.map((company, index) => (
                <div
                  key={company.name + index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
                >
                  {/* Company Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h3>
                    </div>
                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Company Info */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">TrustCenter</div>
                      <div className="font-semibold text-gray-900 dark:text-white">Active</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
                      <div className="font-semibold text-gray-900 dark:text-white">Verified</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    <a
                      href={company.trustCenter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
                    >
                      Trust Center
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredTrustCenters.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No companies found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or include small companies.</p>
              </div>
            )}
          </div>
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
