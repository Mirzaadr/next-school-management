import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    PORT: process.env.PORT || 3000,
  },

};

export default nextConfig;
