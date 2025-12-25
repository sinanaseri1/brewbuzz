import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // <--- FIX FOR DUMMY DATA
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uawawpfszktqvmvtzvih", // <--- CRITICAL: CHANGE THIS
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;