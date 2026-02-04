import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable all caching to ensure articles appear immediately
  experimental: {
    // Force dynamic rendering
  },
  // Ensure no static optimization
  output: undefined, // Use default (not static export)
};

export default nextConfig;
