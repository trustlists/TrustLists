import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getAllTrustCenters, searchTrustCenters, getStats } from '../utils/trustCenters';

export default function Home({ trustCenters, stats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [displayCount, setDisplayCount] = useState(12); // Show 12 initially
  const [platformFilter, setPlatformFilter] = useState('all');
  const [showPlatformPanel, setShowPlatformPanel] = useState(false);

  // Preview flag: enable with ?platformPreview=1 (no impact by default)
  const platformPreviewEnabled = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('platformPreview') === '1';

  // Get platform from company data (prefers stored platform field, falls back to URL detection)
  const getPlatform = (company) => {
    if (company.platform) return company.platform;
    
    // Fallback: Map a trust center URL to a hosting platform label
    const url = company.trustCenter;
    if (!url) return 'Other';
    try {
      const host = new URL(url).hostname.toLowerCase();
      if (host.includes('safebase.io')) return 'SafeBase';
      if (host.includes('app.conveyor.com') || host.includes('conveyor.com')) return 'Conveyor';
      if (host.includes('delve.co')) return 'Delve';
      if (host.includes('trust.vanta.com') || host.includes('vanta.com')) return 'Vanta';
      if (host.includes('drata.com')) return 'Drata';
      if (host.includes('trustarc.com')) return 'TrustArc';
      if (host.includes('onetrust.com')) return 'OneTrust';
      if (host.includes('secureframe.com')) return 'Secureframe';
      if (host.includes('whistic.com')) return 'Whistic';
      if (host.startsWith('trust.') || host.includes('.trust.') || host.startsWith('security.') || host.includes('.security.')) return 'Self-hosted';
      return 'Other';
    } catch {
      return 'Other';
    }
  };

  // Get platform logo for partner companies (preview only)
  const getPlatformLogo = (platform) => {
    if (!platformPreviewEnabled) return null;
    
    // Platform configurations - ready to be enabled
    const platformConfigs = {
      'SafeBase': {
        name: 'SafeBase',
        logoUrl: 'https://www.google.com/s2/favicons?domain=safebase.io&sz=32',
        website: 'https://safebase.io',
        enabled: true // Currently active
      },
      'Conveyor': {
        name: 'Conveyor',
        logoUrl: 'https://www.google.com/s2/favicons?domain=conveyor.com&sz=32',
        website: 'https://conveyor.com',
        enabled: true // Staged, ready to enable
      },
      'Delve': {
        name: 'Delve',
        logoUrl: 'https://www.google.com/s2/favicons?domain=delve.co&sz=32',
        website: 'https://delve.co',
        enabled: true // Staged, ready to enable
      },
      'Vanta': {
        name: 'Vanta',
        logoUrl: 'https://www.google.com/s2/favicons?domain=vanta.com&sz=32',
        website: 'https://vanta.com',
        enabled: true // Staged, ready to enable
      },
      'TrustArc': {
        name: 'TrustArc',
        logoUrl: 'https://www.google.com/s2/favicons?domain=trustarc.com&sz=32',
        website: 'https://trustarc.com',
        enabled: true // Staged, ready to enable
      },
      'OneTrust': {
        name: 'OneTrust',
        logoUrl: 'https://www.google.com/s2/favicons?domain=onetrust.com&sz=32',
        website: 'https://onetrust.com',
        enabled: true // Staged, ready to enable
      },
      'Secureframe': {
        name: 'Secureframe',
        logoUrl: 'https://www.google.com/s2/favicons?domain=secureframe.com&sz=32',
        website: 'https://secureframe.com',
        enabled: true // Staged, ready to enable
      },
      'Whistic': {
        name: 'Whistic',
        logoUrl: 'https://www.google.com/s2/favicons?domain=whistic.com&sz=32',
        website: 'https://whistic.com',
        enabled: false // Staged, ready to enable
      },
      'Sprinto': {
        name: 'Sprinto',
        logoUrl: 'https://www.google.com/s2/favicons?domain=sprinto.com&sz=32',
        website: 'https://sprinto.com',
        enabled: true // Staged, ready to enable
      },
      'Anecdotes': {
        name: 'Anecdotes',
        logoUrl: 'https://www.google.com/s2/favicons?domain=anecdotes.ai&sz=32',
        website: 'https://anecdotes.ai',
        enabled: true // Staged, ready to enable
      }
    };
    
    const config = platformConfigs[platform];
    if (!config || !config.enabled) return null;
    
    return config;
  };

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close panel on escape key or click outside
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowPlatformPanel(false);
      }
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.platform-panel-container') && !event.target.closest('.platform-filter-button')) {
        setShowPlatformPanel(false);
      }
    };

    if (showPlatformPanel) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showPlatformPanel]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMenu = (companyId) => {
    setOpenMenuId(openMenuId === companyId ? null : companyId);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification(`${type} copied to clipboard!`, 'success');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showNotification(`${type} copied to clipboard!`, 'success');
    }
  };

  const reportIssue = (companyName) => {
    const title = encodeURIComponent(`Issue with ${companyName} listing`);
    const body = encodeURIComponent(`**Company**: ${companyName}

**Issue Description**:
Please describe the issue with this company's listing (e.g., broken link, outdated information, incorrect details, etc.)

**Additional Context**:
Add any other context about the problem here.`);
    
    const githubUrl = `https://github.com/FelixMichaels/TrustLists/issues/new?title=${title}&body=${body}&labels=bug,company-listing`;
    window.open(githubUrl, '_blank');
    showNotification('Issue report opened on GitHub!', 'info');
  };

  const allFilteredTrustCenters = useMemo(() => {
    const results = searchTrustCenters(searchQuery);
    if (!platformPreviewEnabled || platformFilter === 'all') return results;
    return results.filter(c => getPlatform(c) === platformFilter);
  }, [searchQuery, platformFilter, platformPreviewEnabled]);

  const displayedTrustCenters = useMemo(() => {
    return allFilteredTrustCenters.slice(0, displayCount);
  }, [allFilteredTrustCenters, displayCount]);

  const hasMore = allFilteredTrustCenters.length > displayCount;

  const showMore = () => {
    setDisplayCount(prev => prev + 12); // Show 12 more each time
  };

  const showAll = () => {
    setDisplayCount(allFilteredTrustCenters.length);
  };

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(12);
  }, [searchQuery]);

  return (
    <>
      <Head>
        <title>TrustList - Find Company Trust Centers & Compliance Documentation</title>
        <meta name="description" content="Discover trust centers and compliance documentation from 24+ leading companies. Find SOC2, ISO27001, GDPR, and security information from Stripe, GitHub, Salesforce, and more." />
        <link rel="canonical" href="https://trustlists.org" />
        
        {/* Page-specific Open Graph */}
        <meta property="og:title" content="TrustList - Find Company Trust Centers & Compliance Documentation" />
        <meta property="og:description" content="Discover trust centers and compliance documentation from 24+ leading companies. Find SOC2, ISO27001, GDPR, and security information." />
        <meta property="og:url" content="https://trustlists.org" />
        
        {/* Structured Data for Organization List */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "Company Trust Centers Directory",
              "description": "A curated list of company trust centers and compliance documentation",
              "numberOfItems": stats.totalCompanies,
              "itemListElement": trustCenters.slice(0, 12).map((company, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Organization",
                  "name": company.name,
                  "url": company.website,
                  "sameAs": company.trustCenter
                }
              }))
            })
          }}
        />
        
        {/* Organization Structured Data for Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "TrustList",
              "url": "https://trustlists.org",
              "logo": "https://trustlists.org/logo.svg",
              "description": "A curated directory of company trust centers and compliance documentation",
              "sameAs": [
                "https://github.com/FelixMichaels/TrustLists"
              ]
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* In-App Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform transition-all duration-300 ease-in-out ${
            notification.type === 'success' ? 'bg-green-500 text-white' :
            notification.type === 'info' ? 'bg-blue-500 text-white' :
            notification.type === 'error' ? 'bg-red-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {notification.type === 'success' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        )}


        <div className="lg:flex lg:h-screen lg:overflow-hidden">
          {/* Left Sidebar - Fixed on desktop, stacked on mobile */}
          <div className="lg:w-96 bg-white dark:bg-gray-800 shadow-sm lg:flex-shrink-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Logo and Title */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                    <img 
                      src="/logo.svg" 
                      alt="TrustList Logo"
                      className="w-12 h-12"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">TrustList</h1>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                  Helping users connect to trusted companies
                </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      TrustList is a curated directory of company trust centers and compliance documentation. Easily discover and access security, privacy, and compliance information from trusted organizations.
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
                  href="https://github.com/FelixMichaels/TrustLists" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Code
                </a>
                <a 
                  href="https://trustlists.org/trust-centers.json" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  API
                </a>
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-lg"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                    </svg>
                  )}
                  Toggle Theme
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area - Scrollable */}
          <div className="flex-1 lg:overflow-y-auto lg:h-screen">
            <div className="p-4 sm:p-6 lg:p-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="mb-4">
                {/* Search and Filter Container with Smart Responsive Layout */}
                <div className="flex flex-wrap gap-4 items-start sm:items-center">
                  {/* Search Bar - Always Full Width on Mobile, Flexible on Desktop */}
                  <div className="relative w-full sm:flex-1 sm:max-w-2xl">
                    <input
                      type="text"
                      placeholder="Search Companies   Stripe, GitHub, Salesforce..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Platform Filter Button - Toggles Panel Below */}
                  {platformPreviewEnabled && (
                    <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-shrink-0">
                      <button
                        onClick={() => {
                          console.log('Filter button clicked! Current panel state:', showPlatformPanel);
                          setShowPlatformPanel(!showPlatformPanel);
                        }}
                        className={`platform-filter-button flex items-center gap-2 px-4 py-3 border rounded-lg text-sm font-medium transition-colors min-w-[140px] justify-between ${
                          showPlatformPanel || platformFilter !== 'all'
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          <span>{platformFilter === 'all' ? 'Filter' : platformFilter}</span>
                        </div>
                        <svg className={`w-4 h-4 transition-transform ${showPlatformPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Platform Filter Panel - Appears Below Search */}
              {platformPreviewEnabled && showPlatformPanel && (
                <div className="platform-panel-container mb-6">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Filter by Platform</h4>
                      <button
                        onClick={() => setShowPlatformPanel(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Platform Pills/Tags */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All platforms' },
                        { id: 'SafeBase', label: 'SafeBase' },
                        { id: 'Conveyor', label: 'Conveyor' }, 
                        { id: 'Delve', label: 'Delve' },
                        { id: 'Vanta', label: 'Vanta' },
                        { id: 'TrustArc', label: 'TrustArc' },
                        { id: 'OneTrust', label: 'OneTrust' },
                        { id: 'Secureframe', label: 'Secureframe' },
                        { id: 'Whistic', label: 'Whistic' },
                        { id: 'Sprinto', label: 'Sprinto' },
                        { id: 'Anecdotes', label: 'Anecdotes' },
                        { id: 'Self-hosted', label: 'Self-hosted' },
                        { id: 'Other', label: 'Other' }
                      ].map((platform) => (
                        <button
                          key={platform.id}
                          onClick={() => {
                            setPlatformFilter(platform.id);
                            setShowPlatformPanel(false);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            platformFilter === platform.id
                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                          }`}
                        >
                          {platform.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
            </div>

            {/* Company Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
              {displayedTrustCenters.map((company, index) => (
                <div
                  key={company.name + index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
                >
                      {/* Company Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-white border border-gray-200 dark:border-gray-600">
                            {company.iconUrl ? (
                              <img 
                                src={company.iconUrl} 
                                alt={`${company.name} logo`}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" style={{display: company.iconUrl ? 'none' : 'flex'}}>
                              <span className="text-white font-bold">
                                {company.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{company.name}</h3>
                          </div>
                        </div>
                        <div className="relative dropdown-menu">
                          <button 
                            onClick={() => toggleMenu(company.name + index)}
                            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                          
                          {openMenuId === company.name + index && (
                            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10">
                              <button
                                onClick={() => {
                                  window.open(company.website, '_blank');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visit Website
                              </button>
                              <button
                                onClick={() => {
                                  copyToClipboard(company.trustCenter, 'Trust Center URL');
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy Trust Center URL
                              </button>
                              <button
                                onClick={() => {
                                  reportIssue(company.name);
                                  setOpenMenuId(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Report Issue
                              </button>
                            </div>
                          )}
                        </div>
                  </div>

                  {/* Company Info */}
                <div className="mb-6">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Built with</div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900 dark:text-white">{getPlatform(company)}</div>
                      {/* Platform Logo Badge (Preview Only) */}
                      {(() => {
                        const platform = getPlatform(company);
                        const platformLogo = getPlatformLogo(platform);
                        
                        if (!platformLogo) return null;
                        
                        return (
                          <a 
                            href={platformLogo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center hover:opacity-80 transition-opacity"
                            title={`Visit ${platformLogo.name} website`}
                          >
                            <img 
                              src={platformLogo.logoUrl}
                              alt={`${platformLogo.name} logo`}
                              className="w-6 h-6 rounded"
                            />
                          </a>
                        );
                      })()}
                    </div>
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

                {/* Show More / Show All Buttons */}
                {hasMore && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                      onClick={showMore}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Show {Math.min(12, allFilteredTrustCenters.length - displayCount)} More Companies
                    </button>
                    <button
                      onClick={showAll}
                      className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Show All ({allFilteredTrustCenters.length})
                    </button>
                  </div>
                )}

                {/* Results count */}
                {allFilteredTrustCenters.length > 0 && (
                  <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Showing {displayedTrustCenters.length} of {allFilteredTrustCenters.length} companies
                  </div>
                )}

                {allFilteredTrustCenters.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No companies found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
                  </div>
                )}
            </div>
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
