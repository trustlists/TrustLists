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
  basePath: '',
  assetPrefix: '',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
}

module.exports = nextConfig
