/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    basePath: '/goodreads',
    images: {
      domains: ['books.google.com'],
    },
    assetPrefix: '/goodreads/', // Ensure static assets are served correctly
  };
  
  export default nextConfig;
  