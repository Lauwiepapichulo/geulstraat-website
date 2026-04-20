import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['@napi-rs/canvas', 'pdfjs-dist', 'mammoth'],
};

export default nextConfig;
