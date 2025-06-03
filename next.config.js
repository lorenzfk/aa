/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;