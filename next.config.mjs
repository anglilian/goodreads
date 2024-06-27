/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Disable image optimization
    domains: ["books.google.com"],
  },
};

export default nextConfig;
