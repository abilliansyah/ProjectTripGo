import React, { FC, useState, useEffect, useCallback } from 'react';
import { LogOut, Loader2, Menu, X, User, Home, ArrowRight, Mail, Lock, AlertTriangle } from 'lucide-react';

// Import Firebase (Membutuhkan 'firebase' terinstall di proyek Anda)
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User as FirebaseAuthUser, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, onSnapshot, DocumentSnapshot, DocumentData } from 'firebase/firestore';

// --- Global Variable Access (MANDATORY for Canvas environment) ---
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

// --- Definisi Tipe (Interfaces) untuk TypeScript ---
interface UserProfile {
  first_name: string;
  email: string;
  role: 'user' | 'admin';
}

interface NavItem {
  name: string;
  href: string;
}

interface AuthHook {
  user: UserProfile | null;
  firebaseUser: FirebaseAuthUser | null; // <-- FIX: Ditambahkan ke interface
  isLoading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string) => Promise<void>;
  error: string | null;
  resetError: () => void;
}

// Global instances for Firebase services
let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Helper function to handle Firestore path based on app_id
const getUserProfilePath = (userId: string) => {
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  // Path for private user data: /artifacts/{appId}/users/{userId}/userProfile/profile
  return doc(db as Firestore, `artifacts/${appId}/users/${userId}/userProfile`, 'profile');
};

// --- Custom Auth Hook (Menggunakan Firebase Asli) ---
const useAuth = (): AuthHook => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Hanya dianggap terautentikasi jika non-anonymous DAN data profil ada
  const isAuthenticated = !!firebaseUser && !!userProfile && !firebaseUser.isAnonymous; 

  // Reset error helper
  const resetError = useCallback(() => setError(null), []);

  // 1. Initialization and Auth Listener
  useEffect(() => {
    try {
      if (!firebaseApp) {
        // Initialize Firebase services
        const firebaseConfig = JSON.parse(__firebase_config);
        firebaseApp = initializeApp(firebaseConfig);
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);
      }

      const unsubscribeAuth = onAuthStateChanged(auth as Auth, async (user: FirebaseAuthUser | null) => {
        setFirebaseUser(user);
        
        if (!user) {
          // If no user (logged out), reset profile state
          setUserProfile(null);
        }
        setIsLoading(false);
        setIsAuthReady(true);
      });
      
      const initialSignIn = async () => {
        const authInstance = auth as Auth;
        
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(authInstance, __initial_auth_token);
          console.log("Firebase: Signed in with custom token.");
        } else {
          await signInAnonymously(authInstance);
          console.log("Firebase: Signed in anonymously.");
        }
      };

      if (!firebaseUser && !isAuthReady) {
        initialSignIn().catch((err: any) => {
          console.error("Firebase Auth Error:", err);
          setError("Gagal melakukan otentikasi awal.");
          setIsLoading(false);
          setIsAuthReady(true);
        });
      }

      return () => unsubscribeAuth();
    } catch (e: any) {
      console.error("Firebase Initialization Error:", e);
      setError("Gagal menginisialisasi Firebase.");
      setIsLoading(false);
      setIsAuthReady(true);
    }
  }, []); 

  // 2. Real-time Profile Listener (onSnapshot)
  useEffect(() => {
    if (!db || !firebaseUser || !isAuthReady || firebaseUser.isAnonymous) {
      if(firebaseUser?.isAnonymous) {
         setUserProfile(null);
      }
      return; 
    }

    const profileRef = getUserProfilePath(firebaseUser.uid);
    
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap: DocumentSnapshot<DocumentData>) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProfile({
          first_name: data.first_name || firebaseUser.email?.split('@')[0] || 'Pengguna',
          email: data.email || firebaseUser.email || '',
          role: (data.role as 'user' | 'admin') || 'user', 
        });
      } else {
        console.warn("User authenticated but profile document missing. Using default data.");
        setUserProfile({
           first_name: firebaseUser.email?.split('@')[0] || 'Pengguna',
           email: firebaseUser.email || '',
           role: 'user',
        });
      }
    }, (e: any) => { 
        console.error("Firestore Profile Error:", e);
        setError("Gagal mengambil data profil dari Firestore.");
    });

    return () => unsubscribeProfile();
  }, [db, firebaseUser, isAuthReady]); 

  // 3. Login Function (Email/Password)
  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth as Auth, email, password);
    } catch (e: any) {
      console.error("Login Error:", e);
      setError(e.code.replace('auth/', '').replace(/-/g, ' '));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Register Function (Email/Password + First Name)
  const register = async (email: string, password: string, firstName: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      const userId = userCredential.user.uid;

      const profileData: Omit<UserProfile, 'email'> & { email: string } = {
        first_name: firstName,
        email: email,
        role: 'user', 
      };
      
      const profileRef = getUserProfilePath(userId);
      await setDoc(profileRef, profileData, { merge: true });

    } catch (e: any) {
      console.error("Register Error:", e);
      setError(e.code.replace('auth/', '').replace(/-/g, ' '));
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Logout Function
  const logout = async (): Promise<void> => {
    setError(null);
    setIsLoading(true);
    try {
      await signOut(auth as Auth);
    } catch (e: any) {
      console.error("Logout Error:", e);
      setError("Gagal saat keluar.");
    } finally {
      setIsLoading(false);
    }
  };


  return { 
    user: userProfile, 
    firebaseUser, // <-- Mengembalikan firebaseUser
    isLoading: isLoading || !isAuthReady, 
    logout, 
    isAuthenticated, 
    isAuthReady,
    login,
    register,
    error,
    resetError,
  };
};

// --- Komponen AuthModal (Digabungkan) ---
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, login, register, isLoading, error }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      login(email, password);
    } else {
      register(email, password, firstName);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setEmail('');
    setPassword('');
    setFirstName('');
  };

  const title = isLoginView ? 'Masuk ke Akun Anda' : 'Buat Akun Baru';
  const buttonText = isLoginView ? 'Masuk' : 'Daftar';

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#15406A]">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-3" />
            <span className="text-sm font-medium">Terjadi Kesalahan: {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* First Name Field (Only for Register) */}
          {!isLoginView && (
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nama Depan"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
                disabled={isLoading}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min. 6 karakter)"
              required
              minLength={6}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#15406A] focus:border-[#15406A] transition"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#15406A] text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 shadow-lg hover:bg-[#12385e] transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading && <Loader2 size={20} className="animate-spin" />}
            <span>{buttonText}</span>
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 text-center text-sm">
          {isLoginView ? (
            <p>
              Belum punya akun?{' '}
              <button type="button" onClick={toggleView} className="text-[#15406A] font-semibold hover:underline">
                Daftar Sekarang
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button type="button" onClick={toggleView} className="text-[#15406A] font-semibold hover:underline">
                Masuk
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};


// --- Komponen Navbar Utama (Digabungkan) ---
const NAV_ITEMS: NavItem[] = [
  { name: 'Beranda', href: '/' },
  { name: 'Reservasi', href: '/reservasi' },
  { name: 'Pembayaran', href: '/pembayaran' },
  { name: 'Kontak', href: '/kontak' },
];

interface NavLinkProps {
  href: string;
  name: string;
  onClick: () => void;
}
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
  // FIX: Destructuring firebaseUser dari useAuth
  const { user, firebaseUser, isLoading, logout, isAuthenticated, isAuthReady, login, register, error, resetError } = useAuth(); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  
  const isAdmin: boolean = user?.role === 'admin';

  // --- Logika Logout ---
  const handleLogout = async (): Promise<void> => {
    setIsDropdownOpen(false); 
    await logout();
  };
  
  // --- Logika Buka/Tutup Modal ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
    resetError(); // Clear any previous error when opening modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetError(); // Clear error when closing
  };
  // --------------------

  const AuthSection: FC = () => {
    // 1. Loading State (jika Firebase sedang inisialisasi atau otentikasi)
    if (isLoading || !isAuthReady) {
      return (
        <div className="flex items-center space-x-2">
          <Loader2 className="animate-spin text-[#15406A] h-5 w-5" />
          <span className="text-sm text-gray-500 hidden sm:block">Memuat Auth...</span>
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
        onClick={handleOpenModal} // Buka modal login/register
        className="bg-[#15406A] text-white px-4 py-2 rounded-lg text-sm font-medium 
                   shadow-md hover:bg-[#12385e] transition duration-150 flex items-center space-x-2"
      >
        <span>Daftar / Masuk</span>
        <ArrowRight size={16} />
      </button>
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
      
      <main className="p-8 max-w-7xl mx-auto">
          <div className="bg-white p-6 sm:p-10 rounded-xl shadow-lg border border-gray-100">
             <h2 className="text-3xl font-bold text-[#15406A] mb-4">Simulasi Aplikasi TripGo</h2>
             <p className="text-gray-600 mb-6">
                Ini adalah contoh implementasi Navbar dengan otentikasi (login/register) menggunakan Firebase dan Firestore. 
                Coba tombol "Daftar / Masuk" untuk membuka modal otentikasi.
             </p>
             <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
                <p className="font-semibold text-gray-700">Status Autentikasi Saat Ini:</p>
                <p className="text-gray-500">
                    {/* FIX: Menggunakan firebaseUser yang sudah didefinisikan */}
                    User ID: {user ? (user.email || 'N/A') : (firebaseUser?.uid || 'Belum Terautentikasi / Anonymous')}
                </p>
                <p className="text-gray-500">
                    Status: <span className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                              {isAuthenticated ? 'Telah Masuk' : 'Belum Masuk'}
                           </span>
                </p>
             </div>
          </div>
      </main>


      {/* Auth Modal - dipanggil di sini */}
      <AuthModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        login={login}
        register={register}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

export default NavbarApp;