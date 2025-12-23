import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Proactive Fix: Allowing Supabase images for later
      {
        protocol: "https",
        hostname: "*.supabase.co", 
      },
    ],
  },
};

export default nextConfig;