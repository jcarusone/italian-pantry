import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/shop",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "collection", value: "(?<collection>.*)" }],
        destination: "/products/:collection",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "collection", value: "(?<collection>.*)" }],
        destination: "/products/:collection",
        permanent: true,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
