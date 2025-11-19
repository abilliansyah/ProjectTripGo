"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Loader2, Menu, X, User, Home, ArrowRight, Search, Plane, Calendar } from 'lucide-react';

// --- DEFINISI TIPE (Interfaces) ---

interface UserProfile {
  // first_name sekarang bisa null/undefined jika belum login
  first_name: string | null; 
  email: string | null;
  role: 'user' | 'admin' | null;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (firstName: string) => Promise<void>; // Ditambahkan argumen untuk simulasi
  logout: () => Promise<void>;
  router: {
    push: (path: string) => void; 
  };
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className: string;
  fallbackSrc: string;
}

interface NavLinkProps {
  href: string; 
  name: string; 
}

// --- STUB / MOCK useAuth untuk Kompilasi ---
// Ini berfungsi sebagai pengganti hook useAuth yang akan Anda miliki di proyek Next.js nyata Anda
const useAuth = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  
  // Data user tiruan diinisialisasi sebagai null, tanpa 'Budi'
  const [mockUser, setMockUser] = useState<UserProfile | null>(null);

  const user: UserProfile | null = mockUser;

  // Fungsi login tiruan
  const login = async (firstName: string = 'Pengguna') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Mengatur nama depan dari argumen yang diterima (simulasi dari input form)
    setMockUser({ 
        first_name: firstName, 
        email: `${firstName.toLowerCase()}@tripgo.com`, 
        role: 'user' 
    });
    setIsAuthenticated(true); 
    setIsLoading(false);
    console.log(`Simulasi Login Berhasil. Nama: ${firstName}`);
  };

  // Fungsi logout
  const logout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setIsAuthenticated(false);
    setMockUser(null);
    setIsLoading(false);
    console.log("Logout successful (Mocked)");
  };

  const router = {
    push: (path: string) => { 
      console.log(`Simulating navigation to: ${path}`);
      
      // Untuk menguji transisi "Logged In" di Preview ini
      // Jika di-redirect ke /dashboard, kita simulasikan login dengan nama default
      if (path === '/dashboard' && !isAuthenticated) {
          login('Penumpang'); // Contoh nama default
      }
    }
  };

  return { user, isLoading, login, logout, isAuthenticated, router };
};
// --- END STUB / MOCK useAuth ---

// --- COMPONENT: ImageWithFallback ---
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, fallbackSrc }) => {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    const handleError = useCallback(() => {
        if (imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
    }, [imgSrc, fallbackSrc]);

    return (
        <img 
            src={imgSrc} 
            alt={alt} 
            className={className} 
            onError={handleError}
        />
    );
};

// --- COMPONENT: Navbar (Exported untuk digunakan di layout.tsx) ---
const NAV_ITEMS = [
  { name: 'Beranda', href: '/' },
  { name: 'Reservasi', href: '/reservasi' },
  { name: 'Pembayaran', href: '/pembayaran' },
  { name: 'Kontak', href: '/kontak' },
];

export const Navbar: React.FC = () => {
  // useAuth sekarang menyediakan user, isLoading, dll.
  const { user, isLoading, logout, isAuthenticated, router, login } = useAuth(); 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Mengambil peran, default ke null jika user null
  const isAdmin = user?.role === 'admin';

  // --- Logika Logout ---
  const handleLogout = async () => {
    setIsDropdownOpen(false); 
    await logout();
    router.push('/'); 
  };
  // --------------------

  const NavLink: React.FC<NavLinkProps> = ({ href, name }) => ( 
    <a 
      href={href} 
      className="text-gray-700 hover:text-[#15406A] px-3 py-2 rounded-lg text-sm font-medium transition duration-150"
    >
      {name}
    </a>
  );

  const AuthSection: React.FC = () => {
    // 1. Loading State
    if (isLoading) {
        return (
            <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin text-[#15406A] h-5 w-5" />
                <span className="text-sm text-gray-500 hidden sm:block">Memuat sesi...</span>
            </div>
        );
    }

    // 2. Authenticated State (Logged In)
    if (isAuthenticated && user && user.first_name) {
        // Menggunakan first_name dari hasil login/daftar
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
                            onClick={() => { setIsDropdownOpen(false); router.push('/dashboard'); }}
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
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center justify-start border-t mt-1 transition"
                        >
                            <LogOut size={16} className="mr-2" />
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // 3. Unauthenticated State (Not Logged In)
    return (
        <button 
            // Mengarahkan ke route login yang Anda miliki (yang benar di Next.js)
            onClick={() => router.push('/login')} 
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
             {/* Auth Section di Mobile: Tetap tampilkan tombol Auth */}
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
};

// --- COMPONENT: SearchForm (Stub/Mock Client Component) ---
const SearchForm: React.FC = () => {
    const [origin, setOrigin] = useState('Cilegon');
    const [destination, setDestination] = useState('Tanahabang');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault();
        console.log(`Mencari tiket: ${origin} -> ${destination} pada ${date}`);
        if (typeof window !== 'undefined') {
            console.log(`Simulasi Pencarian: ${origin} ke ${destination} pada ${date}.`);
        }
    };

    return (
        <div className="relative z-10 -mt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <form 
                    onSubmit={handleSubmit}
                    className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-100 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
                >
                    {/* Input Asal */}
                    <div className="flex-1">
                        <label htmlFor="origin" className="block text-xs font-medium text-gray-500 mb-1">Kota Asal</label>
                        <div className="relative">
                            <Plane size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#15406A]" />
                            <select 
                                id="origin" 
                                value={origin} 
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] appearance-none transition"
                            >
                                <option>Cilegon</option>
                                <option>Serang</option>
                                <option>Rangkasbitung</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Input Tujuan */}
                    <div className="flex-1">
                        <label htmlFor="destination" className="block text-xs font-medium text-gray-500 mb-1">Kota Tujuan</label>
                        <div className="relative">
                            <Plane size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#15406A] rotate-180" />
                            <select 
                                id="destination" 
                                value={destination} 
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] appearance-none transition"
                            >
                                <option>Tanahabang</option>
                                <option>Jakarta</option>
                                <option>Bandung</option>
                            </select>
                        </div>
                    </div>

                    {/* Input Tanggal */}
                    <div className="flex-1">
                        <label htmlFor="date" className="block text-xs font-medium text-gray-500 mb-1">Tanggal Keberangkatan</label>
                        <div className="relative">
                            <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#15406A]" />
                            <input 
                                type="date" 
                                id="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
                            />
                        </div>
                    </div>

                    {/* Tombol Cari */}
                    <button
                        type="submit"
                        className="md:self-end bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition shadow-lg flex items-center justify-center space-x-2"
                    >
                        <Search size={20} />
                        <span>Cari Tiket</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- COMPONENT: Footer ---
const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white mt-32 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-8">
      
      {/* Kolom 1: Logo & Deskripsi */}
      <div className="w-full md:w-1/4">
        <h3 className="text-2xl font-bold mb-4">TripGo</h3>
        <p className="text-gray-400 text-sm">
          Mulai perjalananmu bersama minibus TripGo yang selalu mendampingi setiap waktu. Kenyamanan penumpang utama kami adalah mendampingi.
        </p>
      </div>
      
      {/* Kolom 2 & 3: Info & Kontak */}
      <div className="flex w-full md:w-1/2 justify-around">
        <div>
          <h4 className="text-lg font-semibold mb-4">Informasi</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">Website</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Karir</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Kontak</h4>
          <p className="text-sm text-gray-400">+6281-2245-6789</p>
          <p className="text-sm text-gray-400">kontak@tripgo.com</p>
        </div>
      </div>

      {/* Kolom 4: Outlet */}
      <div className="w-full md:w-1/4">
        <h4 className="text-lg font-semibold mb-4">Outlet</h4>
        <p className="text-sm text-gray-400">Jl. Gunung Tupak Domtor No. 50A, Bogor, Cilegon, Banten</p>
      </div>
    </div>
    
    <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
      <h5 className="font-semibold mb-2">Ikuti Media Sosial TripGo</h5>
      <p>&copy; {new Date().getFullYear()} TripGo. All rights reserved.</p>
    </div>
  </footer>
);

// --- MAIN APPLICATION COMPONENT (Export Default) ---
const App: React.FC = () => {
  
  // PENTING: Karena <Navbar /> sudah di app/layout.tsx, 
  // kita TIDAK PERLU memanggilnya di sini untuk menghindari duplikasi (tumpuk).
  // Saya hanya menyisakan konten utama halaman.

  return (
    <div className="min-h-screen bg-white font-sans">
        
        {/*
          CATATAN: Di proyek Next.js Anda, pastikan App/Page.tsx (file ini) 
          HANYA berisi konten halaman. Navbar dipanggil di layout.tsx.
        */}

        <main>
          {/* Hero Section */}
          <div className="relative pt-12 pb-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-[#15406A] sm:text-6xl tracking-tight">
                  TripGo
                </h1>
                <p className="mt-3 text-xl text-gray-600 max-w-4xl mx-auto">
                  Trip Go adalah platform perjalanan dan transportasi modern yang dirancang untuk menemani setiap perjalanan Anda. Kami menyediakan layanan minibus dengan menghadirkan pengalaman pemesanan yang mudah, aman, dan nyaman. Trip Go melayani rute Cilegon - Serang - Rangkasbitung - Tanahabang.
                </p>
              </div>
              
              {/* Image Placeholder menggunakan ImageWithFallback (Client Component) */}
              <div className="shadow-2xl rounded-xl overflow-hidden max-w-5xl mx-auto transform translate-y-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1543793757-1944e8c1e403?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Pemandangan indah" 
                  className="w-full h-80 object-cover"
                  fallbackSrc="https://placehold.co/1000x320/007bff/ffffff?text=TripGo+Image"
                />
              </div>
            </div>
            
            {/* SearchForm */}
            <SearchForm />
          </div>
          
          {/* Section Tentang Kami */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 py-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Tentang TripGo</h2>
            <div className="flex flex-wrap items-center gap-10">
              <div className="w-full lg:w-1/2 order-2 lg:order-1">
                <p className="text-gray-600 mb-4 text-lg">
                  TripGo telah dipercaya oleh banyak penumpang sebagai solusi perjalanan antar kota yang aman dan nyaman. Kami menyediakan berbagai jenis minibus modern dengan fasilitas lengkap seperti AC dingin, kursi ergonomis, charger port, dan hiburan selama perjalanan, memastikan setiap perjalanan terasa menyenangkan. Dengan harga tiket yang terjangkau dan sistem pemesanan yang mudah, TripGo berkomitmen untuk memberikan pengalaman terbaik bagi setiap pelanggan.
                </p>
                <p className="text-[#15406A] font-extrabold text-xl mt-6">
                  Nikmati perjalanan tanpa khawatir bersama TripGo.
                </p>
              </div>
              <div className="w-full lg:w-5/12 order-1 lg:order-2">
                {/* Gambar Bus Placeholder menggunakan ImageWithFallback */}
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1544620311-5d93026330b6?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Bus TripGo modern" 
                  className="rounded-xl shadow-2xl w-full h-72 object-cover"
                  fallbackSrc="https://placehold.co/400x288/1f2937/ffffff?text=Bus+TripGo"
                />
              </div>
            </div>
          </section>
          
        </main>
        <Footer />
    </div>
  );
}

export default App;