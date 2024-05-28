/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    basePath: '/goodreads',
    images: {
      domains: ['books.google.com'],
    },
    assetPrefix: '/goodreads/', // Add this line
  };
  
  export default nextConfig;
  