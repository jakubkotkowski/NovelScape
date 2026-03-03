import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //TODO: investigate if unoptimize is good
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/images/**',
      },
    ],
  },
};
export default nextConfig;