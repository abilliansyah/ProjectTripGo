import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  
  // --- KONFIGURASI REWRITES UNTUK LOKAL ---
  async rewrites() {
    return [
      {
        // Menangani pengambilan CSRF Cookie Sanctum
        source: '/sanctum/csrf-cookie',
        destination: 'http://127.0.0.1:8000/sanctum/csrf-cookie',
      },
      {
        // Menangani semua request ke API Laravel
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;