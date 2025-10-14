import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device (screen width < 768px)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    
    // Center the flashlight on initial load (only matters for desktop)
    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 3 // Slightly above center for better view
    });
    setIsMounted(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <>
      <Head>
        <title>404 - Trust us, you are lost | TrustList</title>
        <meta name="description" content="Page not found - Trust us, you are lost" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* Dark background layer - only on desktop */}
      {!isMobile && <div className="fixed inset-0 bg-gray-950 z-0"></div>}
      
      {/* Content layer with conditional flashlight effect */}
      <div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center px-4 relative z-10"
        style={{
          maskImage: !isMobile && isMounted ? `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black 60%, transparent 100%)` : 'none',
          WebkitMaskImage: !isMobile && isMounted ? `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, black 60%, transparent 100%)` : 'none',
        }}
      >
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
          
          {/* Flashlight Icon */}
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
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
            <p>Lost but not forgotten{!isMobile && ' • Move your cursor to find your way'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
