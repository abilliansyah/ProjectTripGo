// app/dashboard/page.tsx (Contoh halaman yang diproteksi)
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/UseAuth';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika tidak sedang loading DAN tidak terautentikasi, redirect ke login
    if (!isLoading && !isAuthenticated) {
      router.push('/login'); 
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading user session...</div>;
  }

  if (!isAuthenticated || !user) {
    // Ini hanya akan tampil sebentar sebelum redirect
    return null; 
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Pengguna</h1>
      <p>Selamat datang, **{user.first_name}**!</p>
      <p>Anda adalah seorang: **{user.role.toUpperCase()}**</p>

      {user.role === 'admin' && (
          <div style={{ border: '1px solid gold', padding: '10px', marginTop: '10px' }}>
              **Anda memiliki akses Admin!**
          </div>
      )}

      <button onClick={logout} style={{ marginTop: '20px' }}>
          Logout
      </button>
    </div>
  );
}