/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/goodreads' : '', // Adjust for local dev
  images: {
    unoptimized: true, // Disable image optimization
    domains: ['books.google.com'],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/goodreads/' : '', // Adjust for local dev
};

export default nextConfig;
