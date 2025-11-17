import React from 'react';
import RegisterForm from '../../components/RegisterForm'; 

export default function RegisterPage() {
  return (
    // 1. Container Penuh Layar: Membuat halaman memiliki tinggi minimum layar dan centering.
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      
      {/* 2. Card/Container Form: Menambahkan lebar, latar belakang putih, shadow, dan padding */}
      <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-100">
        
        {/* Header/Judul Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Silakan Buat Akun!</h1>
          <p className="mt-2 text-lg text-gray-500">
            Buat akun TripGo sebelum memulai perjalanan
          </p>
        </div>

        {/* Memanggil Komponen Form */}
        <RegisterForm />
        
      </div>
    </div>
  );
}