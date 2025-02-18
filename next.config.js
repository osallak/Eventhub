/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        hostname: '**.cyber-scale.me',
      },
    ],
  },
  i18n,
};

module.exports = nextConfig;
