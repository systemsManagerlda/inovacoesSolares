import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Substitua `domains` por `remotePatterns` (recomendado)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'woo.inovacoessolares.co.mz',
        port: '',
        pathname: '/wp-content/uploads/**',  // Especifica o caminho das imagens do Woo
      },
    ],
    
    // Adicione as qualidades que você está usando
    qualities: [75, 85, 90],
  },
};

export default nextConfig;