const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4002/api",
    NEXT_PUBLIC_FRONTEND_URL:
      process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add path aliases support for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
  experimental: {
    // Enable modern bundling for better compatibility
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
