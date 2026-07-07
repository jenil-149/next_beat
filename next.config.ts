import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.210.89.228"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zznzwbimduqhmwiqqxia.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
