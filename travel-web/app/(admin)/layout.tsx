// app/admin/layout.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { AuthProvider, useAuth } from '@/lib/AuthContext'; 

// --- Komponen Proteksi dan Layout Utama ---
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Logika redirect sekarang HANYA ada di useEffect.
  useEffect(() => {
    // Jika masih memuat data dari API (misalnya, saat page refresh), JANGAN LAKUKAN APA-APA.
    if (isLoading) return;
    
    // Jika loading selesai dan TIDAK lolos validasi (user null ATAU role bukan admin)
    if (!user || user.role !== 'admin') {
      // Redirect ke halaman login
      router.push('/login'); 
    }
    // Jika lolos (isLoading=false dan user.role='admin'), useEffect selesai.
  }, [user, isLoading, router]);


  // --- CONDITIONAL RENDERING ---

  // 1. Tampilkan layar memuat saat state sedang diambil (INITIAL LOAD)
  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="text-xl font-semibold text-gray-700">Memeriksa status otentikasi...</div>
        </div>
    );
  }

  // 2. Jika loading selesai TAPI user TIDAK lolos validasi,
   //    biarkan useEffect menjalankan redirect. Jangan render konten dashboard.
   //    Menggunakan return null di sini mencegah flashing/rendering yang tidak perlu.
  if (!user || user.role !== 'admin') {
    return null; 
  }
  
  // 3. Tampilan Dashboard setelah lolos proteksi
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