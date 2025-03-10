import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // prevents site from being embedded in an iframe on another domain (clickjacking attack)
  async headers() {
    return [
      {
        source: "/(.*)?",
        headers: [{ key: "X-Frame-Options", value: "SAMEORIGIN" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/accounts/sign-up",
        destination: "/sign-up",
        permanent: true,
      },
      {
        source: "/sign-in",
        destination: "/",
        permanent: true,
      },
      {
        source: "/signin",
        destination: "/",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/sign-up",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
