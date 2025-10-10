import '../styles/globals.css';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-0F4WVM2J69';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ID) return;
    const handleRouteChange = (url) => {
      window.gtag?.('config', GA_ID, { page_path: url });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    // fire once on initial load
    if (typeof window !== 'undefined') {
      handleRouteChange(window.location.pathname);
    }
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Head>
        <title>TrustList - Company Trust Centers Directory</title>
        <meta name="description" content="A curated list of company trust centers and compliance documentation. Find security, privacy, and compliance information for leading companies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        
        {/* SEO Keywords */}
        <meta name="keywords" content="trust center, compliance, security, privacy, SOC2, ISO27001, GDPR, HIPAA, company security, data protection, security documentation, compliance framework, trust and safety, cybersecurity, data governance" />
        <meta name="author" content="TrustList" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://trustlists.org" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="TrustList - Company Trust Centers Directory" />
        <meta property="og:description" content="A curated list of company trust centers and compliance documentation. Find security, privacy, and compliance information for leading companies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trustlists.org" />
        <meta property="og:image" content="https://trustlists.org/logo.svg" />
        <meta property="og:image:width" content="112" />
        <meta property="og:image:height" content="112" />
        <meta property="og:image:alt" content="TrustList - Find Company Trust Centers & Compliance" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:site_name" content="TrustList" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TrustList - Company Trust Centers Directory" />
        <meta name="twitter:description" content="A curated list of company trust centers and compliance documentation. Find security, privacy, and compliance information for leading companies." />
        <meta name="twitter:image" content="https://trustlists.org/logo.svg" />
        <meta name="twitter:image:alt" content="TrustList - Find Company Trust Centers & Compliance" />
        <meta name="twitter:image:width" content="112" />
        <meta name="twitter:image:height" content="112" />
        <meta name="twitter:site" content="@trustlist" />
        <meta name="twitter:creator" content="@trustlist" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="application-name" content="TrustList" />
        <meta name="apple-mobile-web-app-title" content="TrustList" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Structured Data for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TrustList",
              "description": "A curated directory of company trust centers and compliance documentation",
              "url": "https://trustlists.org",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://trustlists.org/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "author": {
                "@type": "Organization",
                "name": "TrustList"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TrustList"
              }
            })
          }}
        />
        
        {/* Accessibility Widget - SiennaAccessibility */}
        <script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
      </Head>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      <Component {...pageProps} />
    </>
  );
}
