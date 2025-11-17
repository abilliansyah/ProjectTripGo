'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import komponen Image
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Bagian Kiri: Logo TripGo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo-tripgo.png" // Path ke folder public (hanya /namafile.png)
                alt="Logo TripGo" 
                width={100}           // Tentukan lebar (wajib untuk optimasi)
                height={40}          // Tentukan tinggi (wajib untuk optimasi)
                priority              // Opsional: Untuk memuat logo lebih cepat
              />
            </Link>
          </div>

          {/* Bagian Tengah: Menu Navigasi */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              Beranda
            </Link>
            {/* Tambahkan link navigasi lain di sini (Reservasi, Cara Pembayaran, Outlet, Kontak) */}
          </div>

          {/* Bagian Kanan: Auth Buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              // Jika sudah Login
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Hi, {user?.first_name || 'User'}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Jika belum Login
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md">
                Daftar/Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}