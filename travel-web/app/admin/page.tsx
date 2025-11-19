// app/admin/page.tsx (Hanya untuk Admin)
"use client";

import React from 'react';
// PERBAIKAN: Menggunakan relative path untuk mengatasi error alias path
import AuthGuard from '../../components/AuthGuard'; 
import { useAuth } from '../../hooks/useAuth'; 
import { AlertTriangle } from 'lucide-react';

export default function AdminPageWrapper() {
  return (
    // Wrap halaman admin dengan AuthGuard
    <AuthGuard>
      <AdminPage />
    </AuthGuard>
  );
}

// Komponen utama Halaman Admin
function AdminPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Catatan: Logic isLoading dan isAuthenticated sudah ditangani di AuthGuard.
  // Kita hanya perlu memastikan role-nya adalah 'admin'.
  
  // Jika user ada dan role BUKAN admin, tampilkan akses ditolak.
  if (user && user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-red-50 p-6">
        <div className="text-center bg-white p-10 rounded-xl shadow-2xl border-t-4 border-red-600">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700 mb-2">AKSES DITOLAK</h1>
          <p className="text-gray-600">Anda tidak memiliki izin akses sebagai Admin.</p>
          <p className="text-sm text-gray-500 mt-4">Peran Anda saat ini: <span className="font-semibold capitalize">{user.role}</span></p>
        </div>
      </div>
    );
  }

  // Jika user ada dan role adalah 'admin', tampilkan konten dashboard
  // (Pastikan user ada sebelum mengakses properti. AuthGuard memastikan isAuthenticated=true)
  if (user && user.role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-red-700 mb-6 border-b pb-2">Admin Dashboard</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 border border-gray-100">
          <p className="text-xl">Selamat datang di Panel Admin, <span className="font-semibold text-red-600">{user.first_name}!</span></p>
          <p className="text-sm text-gray-500 mt-2">Anda dapat mulai mengelola data di sini.</p>
          
          <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">Info Akun Admin</h2>
            <p className="text-gray-700">Email: {user.email}</p>
            <p className="text-gray-700">Role: <span className="font-bold text-red-600 uppercase">{user.role}</span></p>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Tugas Admin:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 pl-4">
              <li>Mengelola daftar reservasi.</li>
              <li>Memverifikasi pembayaran.</li>
              <li>Mengelola data pengguna.</li>
              <li>Mengupdate harga paket perjalanan.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Fallback (Seharusnya tidak pernah tercapai karena AuthGuard akan menangani loading/redirect)
  return <div className="p-10 text-center text-gray-500">Memeriksa izin akses...</div>;
}