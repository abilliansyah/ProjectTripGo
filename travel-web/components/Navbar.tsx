// components/Navbar.tsx
"use client";

import React, { useContext } from 'react';
// Asumsi 'next/link' dan 'next/navigation' tersedia
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';
// Asumsi path alias ini tersedia di project Next.js Anda
import { AuthContext } from '@/context/AuthContext'; 
import { LogOut, Loader2 } from 'lucide-react';

export default function Navbar() {
  const context = useContext(AuthContext);
  
  // Jika context belum tersedia atau null (misal, di luar AuthProvider), tampilkan null/kosong.
  if (!context) {
    // Jika komponen ini berada di root layout, Anda mungkin ingin mengembalikan 
    // tampilan default sederhana tanpa data user.
    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-[#15406A]">TripGo</Link>
                <Link href="/login">
                    <button className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Daftar / Masuk
                    </button>
                </Link>
            </div>
        </nav>
    );
  }

  const { user, isLoading, logout } = context;
  const router = useRouter();
  
  const handleLogout = () => {
    // Panggil fungsi logout dari context
    logout();
    router.push('/login'); // Arahkan ke halaman login setelah logout
  };

  // Tampilkan loading spinner jika isLoading true (Fast Rehydration)
  if (isLoading) {
    return (
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-end items-center">
          <Loader2 className="animate-spin text-gray-500" size={24} />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-[#15406A]">TripGo</h1>
          </Link>
          
          {/* Nav Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-900 hover:text-[#15406A] px-3 py-2 text-sm font-medium transition duration-150">Beranda</Link>
            <Link href="/reservasi" className="text-gray-500 hover:text-[#15406A] px-3 py-2 text-sm font-medium transition duration-150">Reservasi</Link>
            <Link href="/pembayaran" className="text-gray-500 hover:text-[#15406A] px-3 py-2 text-sm font-medium transition duration-150">Cara Pembayaran</Link>
            <Link href="/kontak" className="text-gray-500 hover:text-[#15406A] px-3 py-2 text-sm font-medium transition duration-150">Kontak</Link>
            {/* Tampilkan link Dashboard jika user ada */}
            {user && (
                <Link href="/dashboard" className="text-green-600 hover:text-green-800 px-3 py-2 text-sm font-medium transition duration-150">
                    Dashboard
                </Link>
            )}
          </div>

          {/* Auth Button (Kanan Atas) */}
          <div className="flex items-center">
            {user ? (
              // Tampilan jika user SUDAH LOGIN
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  Halo, {user.first_name || 'Pengguna'}!
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg 
                             text-sm font-medium shadow-md hover:bg-red-700 transition duration-150"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              // Tampilan jika user BELUM LOGIN
              <Link href="/login">
                <button
                  className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                             shadow-md hover:bg-[#12385e] transition duration-150"
                >
                  Daftar / Masuk
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}