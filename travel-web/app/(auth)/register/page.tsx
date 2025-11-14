"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// MEMPERBAIKI PATH: Mengubah dari "@/app/(auth)/AuthHeader" menjadi "../AuthHeader"
import AuthHeader from "../AuthHeader"; 

// Ikon (asumsi menggunakan lucide-react)
import { Mail, Lock, Phone, CheckCircle } from 'lucide-react'; 

// --- KONFIGURASI API ---
// Ganti dengan URL dasar API Laravel Anda.
// Contoh: 'https://nama-aplikasi-anda.up.railway.app'
const API_BASE_URL = 'mysql://root:pBltpAWUyrzWcPvIbwSLWgjCKVEzQSlr@maglev.proxy.rlwy.net:19031/railway'; 
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/register`;

// Styling card background sesuai dengan HTML sebelumnya
const cardBackgroundStyle = {
  background: '#ffffff',
  backgroundImage: 'linear-gradient(180deg, #fcfcfc 0%, #ffffff 100%)',
};

export default function RegisterPage() {
  const router = useRouter();
  
  const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreePrivacy: false,
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State untuk pesan sukses
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setForm(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (form.password !== form.confirmPassword) {
        setError("Konfirmasi kata sandi tidak cocok.");
        return;
    }
    
    if (!form.agreePrivacy) {
        setError("Anda harus menyetujui kebijakan privasi.");
        return;
    }
    
    setIsSubmitting(true);

    // --- LOGIKA FETCH REGISTER YANG SEBENARNYA ---
    
    // Siapkan data yang akan dikirim ke API
    const dataToSend = {
        name: `${form.firstName} ${form.lastName}`, // Menggabungkan nama
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.confirmPassword, // Sesuai convention Laravel
    };
    
    try {
        const response = await fetch(REGISTER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Pastikan 'Origin' diizinkan di public/index.php Laravel
            },
            body: JSON.stringify(dataToSend),
        });

        // Tangani respons
        if (response.ok) {
            // Pendaftaran berhasil
            setSuccess("Pendaftaran berhasil! Anda akan diarahkan ke halaman masuk.");
            
            // Tunggu sebentar sebelum redirect
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/auth/login');
        } else {
            // Pendaftaran gagal (misalnya email sudah terdaftar, validasi gagal)
            const errorData = await response.json();
            
            // Coba ekstrak pesan error dari respons API Laravel
            let errorMessage = "Pendaftaran gagal. Silakan coba lagi.";
            
            if (errorData.message) {
                // Untuk error umum seperti "Unprocessable Content" atau "User already exists"
                errorMessage = errorData.message;
            } else if (errorData.errors && typeof errorData.errors === 'object') {
                // Untuk error validasi (seperti email sudah terdaftar, password kurang kuat)
                const firstErrorKey = Object.keys(errorData.errors)[0];
                errorMessage = errorData.errors[firstErrorKey][0] || errorMessage;
            }
            
            setError(errorMessage);
        }

    } catch (err: any) {
        // Error koneksi atau masalah jaringan
        console.error("Error saat fetch register:", err);
        setError("Gagal terhubung ke server. Periksa koneksi atau URL API.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // Kita gunakan styling body dari HTML sebelumnya
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 antialiased" style={{ background: 'linear-gradient(135deg, #f0f4f8 0%, #e0e7f0 100%)' }}>
      
      <AuthHeader />
      
      {/* Konten Utama (Register) */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          {/* Card Autentikasi */}
          <div 
            style={cardBackgroundStyle}
            className="p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-100"
          >
            
            {/* Halaman Register Content */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Silakan Buat Akun!</h1>
            <p className="text-gray-500 text-center mb-8">Buat akun TripGo sebelum memulai perjalanan</p>

            {/* Kotak Pesan Error */}
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-300">
                {error}
              </p>
            )}
            
            {/* Kotak Pesan Sukses */}
            {success && (
              <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm border border-green-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            )}

            <form onSubmit={handleSubmit}>
                
              {/* Nama Depan & Belakang */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
                      <input 
                          type="text" 
                          id="firstName" 
                          placeholder="Nama Depan Anda" 
                          value={form.firstName}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none" 
                      />
                  </div>
                  <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
                      <input 
                          type="text" 
                          id="lastName" 
                          placeholder="Nama Belakang Anda" 
                          value={form.lastName}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none" 
                      />
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Mail className="w-5 h-5" />
                      </span>
                      <input 
                          type="email" 
                          id="email" 
                          placeholder="Masukkan Alamat Email" 
                          value={form.email}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none" 
                      />
                  </div>
              </div>

              <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                  <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                          <Phone className="w-5 h-5" />
                      </span>
                      <input 
                          type="tel" 
                          id="phone" 
                          placeholder="Masukkan Nomor Telepon" 
                          value={form.phone}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none" 
                      />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                      <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <Lock className="w-5 h-5" />
                          </span>
                          <input 
                              type="password" 
                              id="password" 
                              placeholder="Masukkan Kata Sandi" 
                              value={form.password}
                              onChange={handleChange}
                              required
                              disabled={isSubmitting}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none" 
                          />
                      </div>
                  </div>
                  <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi</label>
                      <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                              <CheckCircle className="w-5 h-5" />
                          </span>
                          <input 
                              type="password" 
                              id="confirmPassword" 
                              placeholder="Masukkan Ulang Kata Sandi" 
                              value={form.confirmPassword}
                              onChange={handleChange}
                              required
                              disabled={isSubmitting}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none" 
                          />
                      </div>
                  </div>
              </div>

              {/* Checkbox Persetujuan */}
              <div className="flex items-center mb-8 text-sm">
                  <input 
                      id="agreePrivacy" 
                      type="checkbox" 
                      checked={form.agreePrivacy}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      required
                      disabled={isSubmitting}
                  />
                  <label htmlFor="agreePrivacy" className="ml-2 text-gray-600">saya setuju dengan kebijakan privasi</label>
              </div>
              
              {/* Tombol Daftar */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 text-lg 
                  ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-700'}`}
              >
                {isSubmitting ? "Memproses..." : "Daftar"}
              </button>
            </form>

            {/* Link Masuk */}
            <p className="text-center mt-6 text-gray-600 text-sm">
              sudah punya akun? 
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-semibold transition duration-150">masuk disini</Link>
            </p>

          </div>
        </div>
      </main>
      
    </div>
  );
}