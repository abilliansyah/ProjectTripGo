"use client";

import React, { useState, FC } from 'react';
import { LogOut, Loader2, Menu, X, User, Home, ArrowRight } from 'lucide-react';

// --- Definisi Tipe (Interfaces) untuk TypeScript ---
interface User {
  first_name: string;
  email: string;
  role: 'user' | 'admin';
}

interface NavItem {
  name: string;
  href: string;
}

interface NavLinkProps extends NavItem {}

interface AuthHook {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  router: { push: (path: string) => void };
  login: () => Promise<void>;
}

// --- STUB / MOCK useAuth Hook (dengan Tipe Data yang Jelas) ---
const useAuth = (): AuthHook => {
  // State untuk simulasi status otentikasi
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Data user yang ditampilkan
  const user: User | null = isAuthenticated ? { 
    first_name: 'Abil', 
    email: 'abil.test@example.com', 
    // Untuk tujuan pengujian, Anda bisa mengubah ini menjadi 'admin'
    role: 'user' 
  } : null; 

  // Mock router.push
  const router = {
    push: (path: string) => {
      console.log(`Simulasi navigasi ke: ${path}`);
    }
  };

  // 1. Mock Login Function
  const login = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Simulasi proses login...");
    
    // Simulasikan delay API (1.5 detik)
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    setIsAuthenticated(true); // Mengubah status menjadi logged-in
    setIsLoading(false);
    
    // PENTING: Arahkan ke Dashboard setelah login
    router.push('/dashboard'); 
  };

  // 2. Mock Logout Function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Simulasi proses logout...");
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAuthenticated(false); // Mengubah status menjadi logged-out
    setIsLoading(false);
    
    // Mengarahkan ke halaman utama ('/') setelah logout
    window.location.href = '/'; 
  };

  return { user, isLoading, logout, isAuthenticated, router, login };
};
// --- END STUB / MOCK ---


const NAV_ITEMS: NavItem[] = [
  { name: 'Beranda', href: '/' },
  { name: 'Reservasi', href: '/reservasi' },
  { name: 'Pembayaran', href: '/pembayaran' },
  { name: 'Kontak', href: '/kontak' },
];

// Komponen NavLink dengan tipe FC (Functional Component) dan Props
const NavLink: FC<NavLinkProps> = ({ href, name }) => (
  <a 
    href={href} 
    className="text-gray-700 hover:text-[#15406A] px-3 py-2 rounded-lg text-sm font-medium transition duration-150"
  >
    {name}
  </a>
);

// Komponen utama Navbar
const Navbar: FC = () => {
  const { user, isLoading, logout, isAuthenticated, login } = useAuth(); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const isAdmin: boolean = user?.role === 'admin';

  // --- Logika Logout ---
  const handleLogout = async (): Promise<void> => {
    setIsDropdownOpen(false); 
    await logout();
  };
  // --------------------

  const AuthSection: FC = () => {
    // 1. Loading State
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin text-[#15406A] h-5 w-5" />
          <span className="text-sm text-gray-500 hidden sm:block">Memproses...</span>
        </div>
      );
    }

    // 2. Authenticated State (Sudah Login)
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
      <button
        onClick={login} // Panggil fungsi mock login
        className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                   shadow-md hover:bg-[#12385e] transition duration-150 flex items-center space-x-2"
      >
        <span>Daftar / Masuk</span>
        <ArrowRight size={16} />
      </button>
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

export default Navbar;