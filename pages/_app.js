import '../styles/globals.css';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>TrustList - Company Trust Centers Directory</title>
        <meta name="description" content="A curated list of company trust centers and compliance documentation. Find security, privacy, and compliance information for leading companies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta property="og:title" content="TrustList - Company Trust Centers Directory" />
        <meta property="og:description" content="A curated list of company trust centers and compliance documentation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trustlist.org" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TrustList - Company Trust Centers Directory" />
        <meta name="twitter:description" content="A curated list of company trust centers and compliance documentation." />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
