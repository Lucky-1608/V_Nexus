import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error allowedDevOrigins is experimental
    allowedDevOrigins: ["http://localhost:3000", "http://192.168.1.8:3000"],
  },
  images: {
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
