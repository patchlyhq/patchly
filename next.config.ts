import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', 'recharts', '@number-flow/react'],
  },
};

export default nextConfig;
