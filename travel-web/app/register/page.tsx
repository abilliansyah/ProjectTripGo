import React from 'react';
import RegisterForm from '@/components/RegisterForm';
import Navbar from '@/components/NavbarApp'; // Gunakan Navbar yang sudah ada
import Link from 'next/link';

// Komponen Halaman Pendaftaran - Server Component
export default function TripGoRegisterPage() {
  return (
    // Background Gradient Hangat (Beige/White) tanpa Navbar
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-white to-[#fef8e8] font-sans text-slate-800 flex items-center justify-center">
      
      {/* Main Container */}
      <div className="w-full max-w-2xl px-4 py-8 md:py-12">
        
        {/* Card Container: Sudut sangat bulat (rounded-[2rem]) dan shadow halus */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 md:px-16 border border-gray-50 relative overflow-hidden">
          
          {/* Efek dekorasi halus di atas (Glow) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-40"></div>

          {/* Header Teks */}
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">Silakan Buat Akun!</h1>
            <p className="text-gray-500 text-sm md:text-base font-medium">
              Buat akun TripGo sebelum memulai perjalanan
            </p>
          </div>
          
          {/* Panggil Komponen Form */}
          <RegisterForm />
          
        </div>
      </div>
    </div>
  );
}