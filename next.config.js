/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['trustlist.org'],
  },
  // GitHub Pages configuration
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/trustlists' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/trustlists/' : '',
  experimental: {
    appDir: false,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
}

module.exports = nextConfig
