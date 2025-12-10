"use client";

import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { LogOut, Menu, X, User, Home, ArrowRight, Plane } from 'lucide-react';

// ===================================================================
// GANTI BLOK SIMULASI INI DENGAN IMPOR ASLI ANDA
// (import { useAuth } from '@/context/AuthContext' dan next/navigation)
// ===================================================================

// --- Simulasi Next.js Router ---
const useRouterSimulated = () => ({
    push: (path: string) => {
        console.log(`[NAVIGASI SIMULASI] Redirect ke: ${path}`);
    },
});

// --- Simulasi User Profile dan Auth Context ---
interface UserProfile {
    uid: string;
    first_name: string;
    email: string;
    role: 'user' | 'admin';
}

const DUMMY_USER: UserProfile = {
    uid: "user-12345",
    first_name: "Budi",
    role: "user", // Ubah ke 'admin' di sini untuk menguji Admin Panel
    email: "budi@tripgo.com"
};

const useAuthSimulated = () => {
    // Atur ke FALSE agar tombol "Daftar / Masuk" muncul secara default
    const [user, setUser] = useState<UserProfile | null>(false ? DUMMY_USER : null); 
    const [loading, setLoading] = useState(true); // Default: Sedang memuat sesi

    useEffect(() => {
        // Simulasikan penundaan pemuatan 1 detik
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000); 
        return () => clearTimeout(timer);
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setUser(null);
        setLoading(false);
    }, []);

    const loginDummy = useCallback(async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setUser(DUMMY_USER);
        setLoading(false);
    }, []);
    
    return useMemo(() => ({
        user,
        logout,
        loading,
        loginDummy // Hapus ini saat menggunakan useAuth asli
    }), [user, logout, loading, loginDummy]);
}

// ===================================================================
// GANTI BLOK SIMULASI DI ATAS DENGAN IMPOR ASLI ANDA
// ===================================================================


// --- Definisi Tipe (Interfaces) ---
interface NavItem {
  name: string;
  href: string;
}

interface NavLinkProps {
  href: string;
  name: string;
}

// --- Data Navigasi ---
const NAV_ITEMS: NavItem[] = [
  { name: 'Beranda', href: '/' },
  { name: 'Reservasi', href: '/reservasi' },
  { name: 'Pembayaran', href: '/pembayaran' },
  { name: 'Kontak', href: '/kontak' },
];

// Komponen NavLink
const NavLink: FC<NavLinkProps> = ({ href, name }) => (
  <a 
    href={href} 
    className="text-gray-700 hover:text-[#15406A] px-3 py-2 rounded-lg text-sm font-medium transition duration-150"
  >
    {name}
  </a>
);

// --- Komponen Utama Navbar ---
const NavbarApp: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  // Ganti useAuthSimulated() dengan useAuth() dan useRouterSimulated() dengan useRouter() 
  // saat menggunakannya di proyek Next.js Anda.
  const { user, logout, loading, loginDummy } = useAuthSimulated();
  const router = useRouterSimulated();

  // Handler untuk logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error saat logout:', error);
    }
  };

  // Komponen untuk bagian authentikasi
  const AuthSection: FC = () => {
    // 1. Tampilkan loading indicator selama AuthContext memuat sesi pengguna.
    if (loading) { 
      return (
        <div className="bg-gray-200 animate-pulse px-4 py-2 rounded-lg w-28 h-9"></div>
      );
    }

    // 2. Jika user belum login (loading sudah false dan user null)
    if (!user) {
      return (
        <div className="flex space-x-2">
          <a
            href="/login"
            className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                        shadow-md hover:bg-[#12385e] transition duration-150 flex items-center space-x-2"
          >
            <span>Daftar / Masuk</span>
            <ArrowRight size={16} />
          </a>
          {/* Tombol Dummy Login hanya untuk pengujian visual di sandbox */}
          <button
            onClick={loginDummy}
            className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-green-700 transition duration-150 hidden lg:block"
            title="Simulasi Masuk: Klik untuk menguji tampilan setelah login."
          >
            Test Login
          </button>
        </div>
      );
    }

    // 3. Jika user sudah login (loading sudah false dan user ada)
    const safeUser = user as UserProfile; // Casting untuk TypeScript
    const displayName: string = safeUser.first_name || safeUser.email?.split('@')[0] || 'User';
    const isAdmin: boolean = safeUser.role === 'admin';

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
          <>
            {/* Overlay untuk menutup dropdown saat klik di luar */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsDropdownOpen(false)}
            ></div>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl z-50 py-1 ring-1 ring-black ring-opacity-5">
              <div className="px-4 py-3 text-sm text-gray-700 font-semibold truncate border-b border-gray-100">
                Halo, {displayName}
              </div>
              
              <a 
                href="/dashboard" 
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition flex items-center" 
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={16} className="mr-2" />
                Dashboard Saya
              </a>

              {isAdmin && (
                <a 
                  href="/admin/dashboard" 
                  className="block px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition flex items-center"
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
          </>
        )}
      </div>
    );
  };

  return (
    <nav className="bg-white sticky top-0 z-40 shadow-md font-sans">
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
            
            {/* Link Dashboard untuk mobile (hanya tampil jika sudah login) */}
            {user && (
              <a 
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#15406A] hover:bg-gray-50"
              >
                Dashboard Saya
              </a>
            )}

            {/* Link Admin Panel untuk mobile (hanya tampil jika admin) */}
            {(user as UserProfile)?.role === 'admin' && (
              <a 
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-red-600 font-bold hover:bg-red-50"
              >
                Admin Panel
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarApp;