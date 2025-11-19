// app/dashboard/page.tsx
"use client";

import React from 'react';
// Impor useAuth diasumsikan tersedia di path '@/hooks/useAuth'
import { useAuth } from '@/hooks/useAuth'; 
// Impor useRouter diasumsikan dari 'next/navigation'
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  // Ambil state dari useAuth
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // 1. Tampilkan "Loading user session..." selama inisialisasi
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading user session...</div>
      </div>
    );
  }

  // 2. Jika Selesai Loading, tapi ternyata TIDAK terotentikasi, redirect ke login
  if (!isAuthenticated) {
    // Kita redirect ke halaman login
    router.replace('/login'); 
    // Tampilkan pesan saat redirect terjadi
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-xl text-red-500">Akses ditolak. Mengarahkan ke halaman Login...</div>
        </div>
    );
  }

  // 3. Tampilan Dashboard jika BERHASIL dan TEROTENTIKASI
  // Pastikan user ada sebelum mengakses propertinya
  if (!user) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="text-xl text-red-500">Data pengguna tidak ditemukan. Harap login kembali.</div>
        </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#15406A] mb-6">Dashboard Pengguna</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <p className="text-lg">Selamat datang kembali, <span className="font-semibold text-blue-600">{user.first_name || 'Pengguna'}!</span></p>
        <p className="text-sm text-gray-500 mt-2">Anda berhasil login menggunakan email: {user.email}</p>
        <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">Informasi Akun</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium text-gray-700">Nama Lengkap:</p>
                    <p className="text-gray-900">{user.first_name} {user.last_name || ''}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Nomor Telepon:</p>
                    <p className="text-gray-900">{user.phone_number || 'Tidak Tersedia'}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">Peran Akun:</p>
                    <p className={`text-gray-900 capitalize ${user.role === 'admin' ? 'text-red-500' : ''}`}>{user.role}</p>
                </div>
                <div>
                    <p className="font-medium text-gray-700">ID Pengguna:</p>
                    <p className="text-gray-900 break-all">{user.id}</p>
                </div>
            </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">Ini adalah halaman yang dilindungi. Sesi Anda berhasil dimuat.</p>
      </div>
    </div>
  );
}