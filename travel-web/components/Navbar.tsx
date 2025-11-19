"use client";

import React, { useState } from 'react';
// Import yang tidak digunakan atau diganti
import { LogOut, Loader2, Menu, X, User, Home, ArrowRight } from 'lucide-react';

// --- STUB / MOCK useAuth untuk Kompilasi di Lingkungan Tanpa Hook Asli ---
// HAPUS SEMUA KODE DARI SINI HINGGA '--- END STUB / MOCK ---' KETIKA MENGGUNAKAN HOOK ASLI.
const useAuth = () => {
  // Anggap saja ini adalah state dummy yang bisa Anda ganti:
  // Kami set isAuthenticated = false agar secara default terlihat tampilan "Daftar / Masuk"
  const isAuthenticated = false; 
  const isLoading = false; 
  const user = isAuthenticated ? { 
    // PENTING: Nama ini harus didapat dari server setelah otentikasi
    first_name: 'Pengguna Tes', 
    email: 'test.user@example.com', 
    role: 'user' // Ganti 'user' ke 'admin' untuk melihat Admin Panel
  } : null; 

  // Stub fungsi-fungsi:
  const logout = async () => {
    console.log("Logout function called (Mocked)");
    // Di aplikasi nyata, ini akan memanggil API /logout dan mereset state
    window.location.href = '/login'; 
  };

  // Mock router.push
  const router = {
    push: (path: string) => {
      console.log(`Simulating navigation to: ${path}`);
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
  // Menggunakan custom hook useAuth
  const { user, isLoading, logout, isAuthenticated, router } = useAuth(); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  // --- Logika Logout ---
  const handleLogout = async () => {
    setIsDropdownOpen(false); 
    await logout();
    // Jika logout berhasil di hook asli, router.push akan dipanggil.
  };
  // --------------------

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
        // PENGGUNAAN DINAMIS: Mengambil first_name dari objek user
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
                        
                        <a 
                            href="/dashboard" 
                            className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition flex items-center" 
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <User size={16} className="mr-2" />
                            Dashboard Saya
                        </a>

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
          
          {/* Logo */}
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
             <AuthSection /> 
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
              <a 
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#15406A] hover:bg-gray-50"
              >
                {item.name}
              </a>
            ))}
            
            {/* Tampilkan link Dashboard di Mobile Menu */}
            {isAuthenticated && (
                 <a 
                    href="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
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