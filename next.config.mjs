/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    basePath: '/goodreads',
    assetPrefix: '/goodreads/',
    images: {
      domains: ['books.google.com'],
    },
  };
  
  export default nextConfig;
  