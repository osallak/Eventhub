/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        hostname: '**.cyber-scale.me',
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
