import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
  },
  images: {
    qualities: [25, 50, 75, 80, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aeadljeuxqgdvcrohaff.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'aeadljeuxqgdvcrohaff.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
};

export default nextConfig;
