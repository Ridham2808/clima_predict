/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.weatherapi.com'],
  },
  // Disable PWA for build stability
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  // Optimize build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
