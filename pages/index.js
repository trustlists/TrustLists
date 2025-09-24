import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import TrustCenterCard from '../components/TrustCenterCard';
import FilterSidebar from '../components/FilterSidebar';
import { getAllTrustCenters, searchTrustCenters, getStats } from '../utils/trustCenters';
import { 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export default function Home({ trustCenters, stats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    industry: 'all',
    certification: 'all',
    framework: 'all',
    companySize: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTrustCenters = useMemo(() => {
    return searchTrustCenters(searchQuery, filters);
  }, [searchQuery, filters]);

  return (
    <>
      <Head>
        <title>TrustList - Company Trust Centers Directory</title>
        <meta name="description" content={`Browse ${stats.totalCompanies} company trust centers across ${stats.totalIndustries} industries. Find security, privacy, and compliance information.`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-trust-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Discover Trusted Companies
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
                A curated directory of company trust centers, security practices, and compliance documentation.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <BuildingOfficeIcon className="w-8 h-8 mr-2" />
                    <span className="text-3xl font-bold">{stats.totalCompanies}</span>
                  </div>
                  <p className="text-primary-100">Companies</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ChartBarIcon className="w-8 h-8 mr-2" />
                    <span className="text-3xl font-bold">{stats.totalIndustries}</span>
                  </div>
                  <p className="text-primary-100">Industries</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ShieldCheckIcon className="w-8 h-8 mr-2" />
                    <span className="text-3xl font-bold">{stats.totalCertifications}</span>
                  </div>
                  <p className="text-primary-100">Certifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-5 h-5 mr-2" />
                Filters
                {Object.values(filters).some(f => f !== 'all') && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Active
                  </span>
                )}
              </button>
            </div>

            {/* Sidebar */}
            <aside className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                resultCount={filteredTrustCenters.length}
              />
            </aside>

            {/* Company Grid */}
            <main className="flex-1">
              {filteredTrustCenters.length === 0 ? (
                <div className="text-center py-16">
                  <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTrustCenters.map((trustCenter) => (
                    <TrustCenterCard key={trustCenter.slug} trustCenter={trustCenter} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-trust-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">TrustList</p>
                  <p className="text-xs text-gray-500">Company Trust Centers</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <a href="/api" className="hover:text-primary-600 transition-colors">API</a>
                <a href="/submit" className="hover:text-primary-600 transition-colors">Submit</a>
                <a href="https://github.com/username/trustlist" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
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
