import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    PORT: process.env.PORT,
  },
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
