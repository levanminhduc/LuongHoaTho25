/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:4002/api",
    NEXT_PUBLIC_FRONTEND_URL: "http://localhost:3000",
  },
};

module.exports = nextConfig;
