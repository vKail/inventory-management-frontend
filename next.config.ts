import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['gitt-api-3tw6.onrender.com']
  }
};

export default nextConfig;
