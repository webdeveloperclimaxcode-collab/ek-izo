import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'izogrup.al',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'izogrup-ontop.fra1.digitaloceanspaces.com',
      },
    ],
  },
  // Increase body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  webpack: (config, { isServer }) => {
    // Ignore Windows system directories
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/.git', '**/Application Data'],
    };
    return config;
  },
};

export default nextConfig;
