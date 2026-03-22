import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["inovacoessolares.co.mz"], // <--- adicione seu domínio aqui
  },
};

export default nextConfig;