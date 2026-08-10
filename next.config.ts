import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/assistenza",
        destination: "/assistenza-care",
        permanent: true,
      },
      {
        source: "/persona-assistenza",
        destination: "/assistenza-care",
        permanent: true,
      },
      {
        source: "/lavoro-tradizionale",
        destination: "/lavoro",
        permanent: true,
      },
      {
        source: "/pet-home",
        destination: "/pet-sitter",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/cookie",
        destination: "/cookie-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
