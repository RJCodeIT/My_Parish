import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/mojaParafia',
  eslint: {
    // Całkowite wyłączenie ESLint podczas budowania
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorowanie błędów TypeScript podczas budowania
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
