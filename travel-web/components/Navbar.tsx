"use client";

import React, { useState } from 'react';
// ERROR FIX: Mengganti import Next.js yang tidak ter-resolve.
// Dalam lingkungan ini, kita akan menggunakan tag <a> standar untuk simulasi navigasi 
// dan menghindari error.
// import Link from 'next/link'; 
// import { useRouter } from 'next/navigation';
import { LogOut, Loader2, Menu, X, User, Home, ArrowRight } from 'lucide-react';
// ERROR FIX: Mengganti path alias ke path relatif (atau menggunakan hook fungsional/stub)
// Karena tidak ada file AuthContext yang di-generate di konteks React tunggal ini,
// saya akan membuat implementasi useAuth yang bersifat Stub/Mock di file ini 
// agar Navbar dapat dikompilasi dan menampilkan logika visualnya.
// JIKA Anda menjalankan ini dalam proyek Next.js, ganti ini dengan import asli Anda:
// import { useAuth } from '@/context/AuthContext'; 

// --- STUB / MOCK useAuth untuk Kompilasi di Lingkungan Tanpa Next.js/Path Alias ---
// Dalam aplikasi nyata (Next.js), HAPUS kode ini dan gunakan import asli di atas.
const useAuth = () => {
  // Anggap saja ini adalah state dummy yang bisa Anda ganti:
  const isAuthenticated = true; // Ganti ke false untuk melihat tampilan "Daftar / Masuk"
  const isLoading = false; // Ganti ke true untuk melihat tampilan "Memuat sesi..."
  const user = isAuthenticated ? { 
    first_name: 'Budi', 
    email: 'budi.travel@example.com', 
    role: 'user' 
  } : null; // Ganti 'user' ke 'admin' untuk melihat Admin Panel

  // Stub fungsi-fungsi:
  const logout = async () => {
    console.log("Logout function called (Mocked)");
    // Di aplikasi nyata, ini akan memanggil API /logout dan mereset state
    // Di sini, kita hanya mengalihkan window.location untuk simulasi router.push
    window.location.href = '/login'; 
  };

  // Mock router.push
  const router = {
    push: (path: string) => {
      console.log(`Simulating navigation to: ${path}`);
      // window.location.href = path; // Gunakan ini di HTML biasa
    }
  };

  return { user, isLoading, logout, isAuthenticated, router };
};
// --- END STUB / MOCK ---


const NAV_ITEMS = [
  { name: 'Beranda', href: '/' },
  { name: 'Reservasi', href: '/reservasi' },
  { name: 'Pembayaran', href: '/pembayaran' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Navbar() {
  // Menggunakan custom hook useAuth dari file AuthContext.tsx yang baru
  const { user, isLoading, logout, isAuthenticated, router } = useAuth(); // Tambahkan router dari stub
  // const router = useRouter(); // Dihapus karena menggunakan mock di atas

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  // --- Logika Logout ---
  const handleLogout = async () => {
    // Tutup dropdown sebelum logout
    setIsDropdownOpen(false); 
    // Panggil fungsi logout dari context (termasuk memanggil API /logout)
    await logout();
    // Arahkan ke halaman login
    // router.push('/login'); // Dihapus karena menggunakan window.location.href di stub
  };
  // --------------------

  // NavLink sekarang menggunakan tag <a> standar untuk menghindari error Link Next.js
  const NavLink = ({ href, name }: { href: string; name: string }) => (
    <a 
      href={href} 
      className="text-gray-700 hover:text-[#15406A] px-3 py-2 rounded-lg text-sm font-medium transition duration-150"
    >
      {name}
    </a>
  );

  const AuthSection = () => {
    // 1. Loading State (jika token sedang divalidasi)
    if (isLoading) {
        return (
            <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin text-[#15406A] h-5 w-5" />
                <span className="text-sm text-gray-500 hidden sm:block">Memuat sesi...</span>
            </div>
        );
    }

    // 2. Authenticated State (Sudah Login)
    if (isAuthenticated && user) {
        const displayName = user.first_name || 'Pengguna';
        
        return (
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 bg-[#15406A] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#12385e] transition duration-150"
                >
                    <User size={16} />
                    <span className="truncate max-w-[100px] hidden sm:block">{displayName}</span>
                </button>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 py-1 ring-1 ring-black ring-opacity-5 origin-top-right animate-in fade-in-0 zoom-in-95">
                        <div className="px-4 py-3 text-sm text-gray-700 font-semibold truncate border-b border-gray-100">
                            Halo, {displayName}
                        </div>
                        
                        {/* Link ke Dashboard User (MENGHILANGKAN 'block', HANYA 'flex') */}
                        <a 
                            href="/dashboard" 
                            className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition flex items-center" 
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <User size={16} className="mr-2" />
                            Dashboard Saya
                        </a>

                        {/* Link ke Admin Dashboard (Khusus Admin) (MENGHILANGKAN 'block', HANYA 'flex') */}
                        {isAdmin && (
                            <a 
                                href="/admin/dashboard" 
                                className="px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition flex items-center"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <Home size={16} className="mr-2" />
                                Admin Panel
                            </a>
                        )}

                        {/* Tombol Logout */}
                        {/* MENGGANTI 'w-full text-left' ke 'flex items-center justify-start' untuk konsistensi flex */}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center border-t mt-1 transition"
                        >
                            <LogOut size={16} className="mr-2" />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // 3. Unauthenticated State (Belum Login)
    return (
        // Menggunakan tag <a> standar
        <a href="/login">
            <button
                className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                           shadow-md hover:bg-[#12385e] transition duration-150 flex items-center space-x-2"
            >
                <span>Daftar / Masuk</span>
                <ArrowRight size={16} />
            </button>
        </a>
    );
  };


  return (
    <nav className="bg-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo (Menggunakan tag <a>) */}
          <a href="/" className="flex-shrink-0">
            <h1 className="text-xl font-extrabold text-[#15406A] tracking-tight">TripGo</h1>
          </a>
          
          {/* Desktop Nav Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.name} href={item.href} name={item.name} />
            ))}
          </div>

          {/* Auth Button (Desktop) */}
          <div className="hidden sm:flex items-center">
            <AuthSection />
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
             <AuthSection /> {/* Tampilkan Auth status juga di mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none ml-2"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a // Menggunakan tag <a>
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                // Menghapus 'block' karena <a> sudah bersifat block secara default di sini, 
                // tapi kita tetap pertahankan jika dibutuhkan. Karena ini ada di mobile menu
                // dan tidak ada 'flex', 'block' tidak menyebabkan konflik di sini.
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#15406A] hover:bg-gray-50"
              >
                {item.name}
              </a>
            ))}
            
            {/* Tampilkan link Dashboard di Mobile Menu */}
            {isAuthenticated && (
                 <a // Menggunakan tag <a>
                    href="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    // Menghapus 'block' untuk menghindari konflik jika ada penambahan 'flex' di masa depan, 
                    // tetapi dalam konteks ini tidak wajib. Saya pertahankan 'block' di mobile menu 
                    // karena tidak ada flex yang bersaing di sini.
                    className="block px-3 py-2 rounded-md text-base font-medium text-green-600 hover:text-green-800 hover:bg-green-50"
                 >
                    Dashboard Saya
                 </a>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}