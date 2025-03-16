import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    useCache: true,
  },
  outputFileTracingExcludes: {
    "**/*": [".next/cache/**/*", ".swc/**/*", ".git/**/*"],
  },
};

export default nextConfig;
