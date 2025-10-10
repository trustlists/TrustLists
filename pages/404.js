import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Trust us, you are lost | TrustList</title>
        <meta name="description" content="Page not found - Trust us, you are lost" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 opacity-20">
              404
            </h1>
          </div>
          
          {/* Main Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trust us, you are lost
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              This page seems to have wandered off into the digital void.
            </p>
          </div>
          
          {/* Search Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-blue-600 dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Find Your Way Home
            </Link>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Or try searching for a trust center:</p>
              <Link 
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse Trust Centers →
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-xs text-gray-400 dark:text-gray-500">
            <p>Lost but not forgotten</p>
          </div>
        </div>
      </div>
    </>
  );
}
