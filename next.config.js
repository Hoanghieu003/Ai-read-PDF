/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    api_key: process.env.api_key,
    REPLACE_HOSTNAME: process.env.REPLACE_HOSTNAME,
  },
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        port: "",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-1549078642-b2ba4bda0cdb/**",
      },
    ],
    domains: ["img.clerk.com"],
  },
};

module.exports = nextConfig;
