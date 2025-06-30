import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.isteonline.in',
        pathname: '/icons/**',
      },
    ],
  },
};

export default nextConfig;
