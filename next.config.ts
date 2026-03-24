import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'woo.inovacoessolares.co.mz',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // Adicionar o domínio principal também
      {
        protocol: 'https',
        hostname: 'inovacoessolares.co.mz',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    
    qualities: [75, 85, 90],
  },
};

export default nextConfig;