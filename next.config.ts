import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: "",
        pathname: "/",
      },
      {
        protocol: "https",
        hostname: "dxgjph0nw8.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
