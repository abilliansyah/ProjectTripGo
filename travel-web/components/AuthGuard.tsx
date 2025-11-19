// components/AuthGuard.tsx (Jika Anda menggunakan ini untuk melindungi halaman)
"use client";

import React, { useContext } from 'react';
// Pastikan path ke context ini benar di struktur folder Anda
import { AuthContext } from '@/context/AuthContext'; 
// Pastikan impor dari 'next/navigation' dapat diselesaikan
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const context = useContext(AuthContext);
    const router = useRouter();

    // 1. Penanganan jika komponen digunakan di luar AuthProvider (untuk debugging)
    if (!context) {
        console.error("AuthGuard digunakan tanpa AuthProvider!");
        // Tampilkan error state yang jelas
        return (
            <div className="flex flex-col justify-center items-center min-h-[50vh] bg-red-100 p-8 rounded-lg shadow-xl">
                <p className="text-xl text-red-700 font-bold mb-2">AUTH ERROR</p>
                <p className="text-sm text-red-600 text-center">Komponen ini harus dibungkus oleh AuthProvider.</p>
            </div>
        );
    }
    
    const { isAuthenticated, isLoading } = context;

    // 2. Tampilkan Loading State selama token divalidasi API (Penting untuk mengatasi "Loading user session..." yang lama)
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-[#15406A] mb-4" size={40} />
                <p className="text-lg text-gray-700">Memuat sesi pengguna...</p>
            </div>
        );
    }

    // 3. Jika tidak terotentikasi setelah loading selesai, redirect ke halaman login
    if (!isAuthenticated) {
        // Menggunakan replace untuk mencegah user kembali ke halaman ini dengan tombol back
        router.replace('/login'); 
        // Tampilkan pesan saat redirect terjadi
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <p className="text-lg text-red-500">Akses ditolak. Mengarahkan...</p>
            </div>
        );
    }

    // 4. Tampilkan konten jika terotentikasi dan loading selesai
    return <>{children}</>;
}