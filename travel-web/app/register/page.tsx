import React from 'react';
import RegisterForm from '@/components/RegisterForm';
import Navbar from '@/components/Navbar'; // Gunakan Navbar yang sudah ada
import Link from 'next/link';

// Komponen Halaman Pendaftaran - Server Component
export default function TripGoRegisterPage() {
  return (
    // Background dengan gradien yang baru
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 font-sans">
      

      {/* --- DIAGNOSTIC BANNER: Jika Tailwind berfungsi, kotak ini akan berwarna merah cerah --- */}
      <div className="bg-red-600 text-white text-center py-1 font-bold">
        Jika Anda melihat kotak ini berwarna merah, Tailwind CSS berhasil dimuat.
      </div>
      {/* ----------------------------------------------------------------------------------- */}

      {/* Registration Form Container */}
      <div className="max-w-md mx-auto px-4 py-12 md:py-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-100">
          
          {/* Header Card */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Silakan Buat Akun!</h1>
            <p className="text-slate-600">Buat akun TripGo sebelum memulai perjalanan</p>
          </div>
          
          {/* Komponen RegisterForm (Client Component) diimpor di sini */}
          <RegisterForm />
          
        </div>
      </div>
    </div>
  );
}