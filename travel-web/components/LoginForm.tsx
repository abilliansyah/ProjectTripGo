"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  // Asumsi hook useAuth ada dan memiliki fungsi 'login'
  const { login } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validasi sederhana
  const validateForm = () => {
    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return false;
    }
    // Menggunakan min 8 karakter agar sesuai dengan validasi backend Laravel
    if (password.length < 8) {
      setError("Kata Sandi minimal 8 karakter.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    if (!API_BASE_URL) {
      setError("NEXT_PUBLIC_API_BASE_URL belum diset. Cek file .env Anda.");
      return;
    }

    try {
      setLoading(true);

      // --- PANGGILAN API ---
      // Endpoint yang digunakan: https://projecttripgo-production.up.railway.app/api/login
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password,
      });

      // --- START: Blok Sukses dengan Penanganan Error Internal ---
      // Ini WAJIB untuk menangkap error runtime JS yang terjadi setelah API call sukses (Status 200 OK)
      try {
        // Backend Anda mengembalikan { user, access_token, token_type } langsung di response.data
        const { access_token, user } = response.data; 
        
        // Memanggil hook login untuk menyimpan token/user
        login(access_token, user); 

        // Redirect hanya jika login dan penyimpanan data berhasil
        router.push("/dashboard");
        
      } catch (runtimeError: any) {
        // Jika terjadi error saat memproses respons (misal, di hook useAuth)
        console.error("Login Runtime Error (After API Success):", runtimeError);
        setError("Login berhasil, tetapi terjadi error saat memproses data pengguna. Silakan coba bersihkan cache/cookies atau periksa hook useAuth.");
      }
      // --- END: Blok Sukses dengan Penanganan Error Internal ---


    } catch (err: any) {
      // --- Blok Kegagalan API (401, 422, 500) ---
      console.error("Login API Error:", err);
      
      let errorMessage = "Email atau Kata Sandi salah.";

      if (err.response) {
          if (err.response.status === 401) {
              // Menangani response 401 dari backend
              errorMessage = err.response.data?.message || errorMessage;
          } else if (err.response.status === 422) {
              errorMessage = "Terdapat kesalahan validasi data.";
          } else {
              errorMessage = `Terjadi kesalahan pada server (Status: ${err.response.status}). Mohon coba lagi.`;
          }
      } else {
          // Kesalahan Jaringan
          errorMessage = "Gagal terhubung ke server. Cek koneksi internet Anda (Error API/CORS).";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">

      {/* Error / Pesan Notifikasi */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Alamat Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="email"
            placeholder="Masukan Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm 
                        focus:ring-2 focus:ring-blue-300 focus:border-blue-500 
                        transition-all duration-200"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1 font-medium">Kata Sandi</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="password"
            placeholder="Masukan Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm
                        focus:ring-2 focus:ring-blue-300 focus:border-blue-500 
                        transition-all duration-200"
          />
        </div>
      </div>

      {/* Remember + Forgot */}
      <div className="flex justify-between text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="rounded border-gray-300"
          />
          ingat saya
        </label>

        <button
          type="button"
          className="text-gray-500 hover:text-gray-700 transition"
        >
          lupa kata sandi?
        </button>
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold text-lg shadow-md transition-all
        ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-[#15406A] hover:bg-[#12385e]"}`}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Memproses...</span>
          </div>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}

/* ---- Animasi Tambahan ---- */
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-shake { animation: shake 0.25s ease-in-out; }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);
}