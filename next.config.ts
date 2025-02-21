import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["assets.aceternity.com", "avatars.githubusercontent.com", "media.licdn.com"], // Add GitHub avatars domain
  },
  webpack: (config) => {
    config.externals['@solana/web3.js'] = 'commonjs @solana/web3.js';
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  /* config options here */
};

export default nextConfig;
