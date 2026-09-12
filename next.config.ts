import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avoid local dev failures when the WordPress origin responds slower than
    // Next's image optimizer timeout. Production keeps full optimization.
    unoptimized: process.env.NODE_ENV === "development",
    qualities: [75, 85],
    remotePatterns: (process.env.WOOCOMMERCE_IMAGE_HOSTS || "").split(",").map((host) => host.trim()).filter(Boolean).map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" })),
  },
};

export default nextConfig;
