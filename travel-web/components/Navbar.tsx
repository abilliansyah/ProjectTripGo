'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 text-2xl font-bold text-blue-700">
            TripGo
          </Link>
          
          {/* Menu Navigasi */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Beranda</Link>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Reservasi</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Cara Pembayaran</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Outlet</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Kontak</a>
          </div>

          {/* Tombol Aksi */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                  Hi, {user?.first_name || 'User'} ({user?.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-150"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" passHref>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition duration-150">
                  Daftar/Masuk
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}