import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for /admin routing
  basePath: '/admin',
  assetPrefix: '/admin',
  
  // Your existing config
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  
  // Additional recommended settings for production
  trailingSlash: true,
  output: 'standalone', // Better for production deployment
};

export default nextConfig;