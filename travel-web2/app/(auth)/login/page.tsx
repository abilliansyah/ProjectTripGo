"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Perbaikan import: Mengubah dari "@/app/(auth)/AuthHeader" menjadi "../AuthHeader"
import AuthHeader from "@/app/(auth)/AuthHeader"; 
// Asumsi: useAuth ada di '@/lib/AuthContext'
import { useAuth } from "@/lib/AuthContext"; 

// Ikon (asumsi menggunakan lucide-react, pastikan library ini terinstal)
import { Mail, Lock } from 'lucide-react'; 

// Styling card background sesuai dengan desain gambar
const cardBackgroundStyle = {
  background: '#ffffff',
  backgroundImage: 'linear-gradient(180deg, #fcfcfc 0%, #ffffff 100%)',
};

// Styling background utama sesuai desain
const mainBackgroundStyle = {
    background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e7f0 100%)',
};


export default function LoginPage() {
  const { login, isLoading: isAuthenticating, user, isLoading } = useAuth(); 
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Panggil fungsi login dari AuthContext
      await login({ email, password });
      // Redirect akan dihandle oleh useEffect setelah state 'user' berubah
    } catch (err: any) {
      // Error sudah di-handle di AuthContext, tetapi kita juga tampilkan di form
      if (err.message.includes('Login gagal')) {
          setError("Kredensial salah. Silakan periksa email dan password Anda.");
      } else {
          // Hanya tampilkan pesan error generik agar tidak membocorkan detail server
          setError("Terjadi kesalahan saat otentikasi. Coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efek untuk redirect jika user sudah login
  useEffect(() => {
    if (!isLoading && user) {
        // Jika user sudah ada (sudah login), arahkan sesuai role
        if (user.role === 'admin') {
            router.push('/admin/dashboard');
        } else {
            router.push('/');
        }
    }
  }, [user, isLoading, router]);


  // Jika sedang memuat status otentikasi saat load halaman
  if (isLoading || isAuthenticating) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 text-lg">Memuat status otentikasi...</div>;
  }


  // Tampilan halaman Login
  return (
    <div className="flex min-h-screen flex-col antialiased" style={mainBackgroundStyle}>
      
      <AuthHeader />
      
      {/* Konten Utama (Login) */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          {/* Card Autentikasi */}
          <div 
            style={cardBackgroundStyle}
            className="p-8 md:p-12 rounded-2xl shadow-2xl transition-all duration-500 ease-in-out border border-gray-100"
          >
            
            {/* Halaman Login Content */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Selamat Datang Kembali!</h1>
            <p className="text-gray-500 text-center mb-8">Masuk untuk memulai perjalananmu bersama TripGo</p>

            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-300">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input 
                    type="email" 
                    id="login-email" 
                    placeholder="Masukkan Alamat Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input 
                    type="password" 
                    id="login-password" 
                    placeholder="Masukkan Kata Sandi" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
                  />
                </div>
              </div>
              
              {/* Checkbox dan Link Lupa Sandi */}
              <div className="flex justify-between items-center mb-8 text-sm">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="remember-me" className="ml-2 text-gray-600">Ingat saya</label>
                </div>
                {/* Mengarahkan ke halaman lupa sandi (masih placeholder) */}
                <Link href="#" className="text-blue-600 hover:text-blue-800 font-medium transition duration-150">lupa kata sandi?</Link>
              </div>
              
              {/* Tombol Masuk */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 text-lg 
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-700'}`}
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </button>
            </form>

            {/* Link Daftar */}
            <p className="text-center mt-6 text-gray-600 text-sm">
              belum punya akun? 
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150">daftar disini</Link>
            </p>

          </div>
        </div>
      </main>
      
    </div>
  );
}