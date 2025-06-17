/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:4002/api",
    NEXT_PUBLIC_FRONTEND_URL: "http://localhost:3000",
  },
<<<<<<< HEAD
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
=======
>>>>>>> 2763e436f2cc17d7447627e9607911591d320994
};

module.exports = nextConfig;
