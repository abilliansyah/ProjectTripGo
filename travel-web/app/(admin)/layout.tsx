// app/admin/layout.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { AuthProvider, useAuth } from '@/lib/AuthContext'; // Ganti @/lib/AuthContext jika path Anda berbeda

// --- Komponen Proteksi dan Layout Utama ---
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 1. Cek loading state
    if (isLoading) return;
    
    // 2. Cek otentikasi & peran
    if (!user || user.role !== 'admin') {
      // Jika tidak login atau bukan admin, redirect ke halaman login
      router.push('/login'); 
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'admin') {
    // Tampilkan loading screen saat mengecek status
    return <div className="text-center mt-20">Memuat...</div>;
  }

  // Tampilan Dashboard setelah lolos proteksi
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-xl font-semibold">Selamat Datang, {user.name}</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// --- Wrapper Provider ---
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}