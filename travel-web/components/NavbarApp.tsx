"use client";

import React, { FC, useState } from 'react';
import { LogOut, Menu, X, User, Home, ArrowRight, Plane } from 'lucide-react';

// --- Definisi Tipe (Interfaces) ---
interface NavItem {
  name: string;
  href: string;
}

interface NavLinkProps {
  href: string;
  name: string;
  onClick: () => void;
}

// --- Data Dummy (Untuk Mendemonstrasikan Tampilan Terautentikasi) ---
// Dalam aplikasi nyata, data ini akan berasal dari React Context / Redux / Zustand.
const DUMMY_USER_PROFILE = {
    first_name: "Budi",
    email: "budi.s@mail.com",
    role: 'user', // Bisa 'user' atau 'admin'
};

const NAV_ITEMS: NavItem[] = [
  { name: 'Beranda', href: '/' },
  { name: 'Reservasi', href: '/reservasi' },
  { name: 'Pembayaran', href: '/pembayaran' },
  { name: 'Kontak', href: '/kontak' },
];

// Komponen NavLink
const NavLink: FC<NavLinkProps> = ({ href, name, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-gray-700 hover:text-[#15406A] px-3 py-2 rounded-lg text-sm font-medium transition duration-150"
  >
    {name}
  </a>
);

// Komponen utama Navbar
const NavbarApp: FC = () => {
  // STATE LOKAL UNTUK DEMONSTRASI:
  // Dalam aplikasi nyata, 'isAuthenticated' dan 'user' akan diambil dari global state management.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<typeof DUMMY_USER_PROFILE | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); 
  
  const isAdmin: boolean = user?.role === 'admin';

  // --- Placeholder Logika (untuk Simulasi Navigasi / Toggle State) ---
  const handleAuthAction = (action: 'login' | 'logout') => {
    if (action === 'login') {
        // Dalam dunia nyata: Ini akan menjadi navigasi ke router.push('/login')
        setIsAuthenticated(true);
        setUser(DUMMY_USER_PROFILE);
    } else {
        // Dalam dunia nyata: Ini akan memanggil logout() dari Auth Context
        setIsAuthenticated(false);
        setUser(null);
        setIsDropdownOpen(false);
    }
  };
  // -------------------------------------------------------------------

  const AuthSection: FC = () => {
    // 1. Authenticated State (Sudah Login)
    if (isAuthenticated && user) {
      const displayName: string = user.first_name || 'Pengguna';
      
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
                // Tombol ini sekarang hanya memanggil fungsi placeholder
                onClick={() => handleAuthAction('logout')} 
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

    // 2. Unauthenticated State (Belum Login)
    // PENTING: Tombol ini sekarang adalah LINK/BUTTON yang MENGARAHKAN
    return (
      <a
        // Dalam aplikasi nyata, ini adalah link ke halaman login Anda (e.g., /auth/login)
        href="/login" 
        onClick={() => {
            // Placeholder: Hanya untuk demonstrasi transisi UI
            handleAuthAction('login'); 
        }}
        className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                   shadow-md hover:bg-[#12385e] transition duration-150 flex items-center space-x-2"
      >
        <span>Daftar / Masuk</span>
        <ArrowRight size={16} />
      </a>
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
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
                <NavLink key={item.name} href={item.href} name={item.name} onClick={() => {}} />
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
                <span className="sr-only">Buka menu utama</span>
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
      
      {/* Konten Utama Aplikasi */}
      <main className="p-8 max-w-7xl mx-auto">
          <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-100">
             <h2 className="text-3xl font-bold text-[#15406A] mb-4 flex items-center">
                <Plane size={28} className="mr-3" />
                Selamat Datang di TripGo
             </h2>
             <p className="text-gray-600 mb-8">
                Ini adalah tampilan halaman utama. Navigasi telah disiapkan.
                Tombol **Daftar / Masuk** di kanan atas sudah diubah agar mengarahkan (atau meniru navigasi) ke halaman otentikasi.
                Saat Anda mengkliknya, tampilan akan berubah menjadi **Logged In**.
             </p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border border-dashed border-gray-300 rounded-lg bg-indigo-50/50">
                <div className="md:col-span-3 text-center">
                    <p className="text-lg font-semibold text-indigo-700">Pencarian Penerbangan</p>
                    <p className="text-sm text-indigo-500">Formulir pencarian tiket akan ditempatkan di sini.</p>
                </div>
             </div>

             <div className="mt-12 pt-6 border-t border-gray-200">
                <p className="font-semibold text-gray-700">Status Tampilan Saat Ini (Mode Demonstrasi):</p>
                <p className="text-gray-500 text-sm">
                    Status: <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                              {isAuthenticated ? `Telah Masuk sebagai ${user?.first_name} (${user?.role})` : 'Belum Masuk'}
                           </span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    *Tampilan status ini hanya untuk demonstrasi transisi UI Navbar. Dalam aplikasi nyata, Anda akan menggunakan Auth Context untuk menentukan status `isAuthenticated` dan data `user`.*
                </p>
             </div>
          </div>
      </main>
    </div>
  );
}

export default NavbarApp;