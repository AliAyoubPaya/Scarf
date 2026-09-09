import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    remotePatterns: (process.env.WOOCOMMERCE_IMAGE_HOSTS || "").split(",").map((host) => host.trim()).filter(Boolean).map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" })),
  },
};

export default nextConfig;
