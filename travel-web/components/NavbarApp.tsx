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

// --- Data Navigasi ---
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

// --- Komponen Utama Navbar ---
const NavbarApp: FC = () => {
  // Hanya menyimpan state untuk interaksi UI seperti menu mobile dan dropdown.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); 
  
  // NOTE PENTING: Untuk menjalankan aplikasi nyata, Anda HARUS mengambil
  // status 'isAuthenticated', 'user', dan fungsi 'logout' dari React Context (atau Redux/Zustand)
  // yang terhubung ke database/Firebase Anda.
  
  // Karena ini adalah komponen presentational murni, kita akan menampilkan
  // tampilan Logged Out (sebagai link) dan memberikan contoh tampilan Logged In (dicomment).

  const AuthSection: FC = () => {

    // ===================================================================
    // TAMPILAN DEFAULT (LOGGED OUT / BELUM MASUK)
    // ===================================================================
    return (
      <a
        // Dalam aplikasi nyata, ini adalah link yang diarahkan oleh router Anda
        href="/login" 
        className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                   shadow-md hover:bg-[#12385e] transition duration-150 flex items-center space-x-2"
      >
        <span>Daftar / Masuk</span>
        <ArrowRight size={16} />
      </a>
    );


    // ===================================================================
    // CONTOH TAMPILAN (LOGGED IN / SUDAH MASUK) - Hapus /* dan */ untuk mengaktifkan
    // Ganti nilai 'DUMMY_USER' dengan data dari Auth Context Anda.
    // ===================================================================
    /*
    const DUMMY_USER = {
        first_name: "John",
        role: "user"
    };
    const displayName: string = DUMMY_USER.first_name;
    const isAdmin: boolean = DUMMY_USER.role === 'admin';
    
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
                // PENTING: Ganti ini dengan fungsi logout yang sebenarnya dari Auth Context Anda
                onClick={() => console.log("Fungsi Logout Dipanggil")} 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center border-t mt-1 transition"
              >
                <LogOut size={16} className="mr-2" />
                Keluar
              </button>
            </div>
          )}
        </div>
    );
    */
    // ===================================================================
  };


  return (
    <div className="font-sans">
      <nav className="bg-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center">
                <Plane size={24} className="text-[#15406A] mr-2" />
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
              
              {/* NOTE: Tampilkan link Dashboard HANYA jika isAuthenticated (harus dihubungkan ke context) */}
              {/* <a href="/dashboard" ...> Dashboard Saya </a> */}
            </div>
          </div>
        )}
      </nav>
      
      {/* PENTING: Tidak ada konten lain di luar komponen Navbar ini. */}
    </div>
  );
}

export default NavbarApp;