"use client";

import React, { useState, useEffect } from "react";
import axiosClient from "@/utils/axiosClient";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  // Menangkap parameter redirect untuk dikembalikan setelah login
  const redirectTo = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Injeksi gaya animasi
  useEffect(() => {
    const styles = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
      }
      .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      .animate-shake { animation: shake 0.2s ease-in-out 2; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => { document.head.removeChild(styleSheet); };
  }, []);

  const validateForm = () => {
    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return false;
    }
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

    try {
      setLoading(true);

      // 1. CSRF Cookie (Sanctum)
      await axiosClient.get("/sanctum/csrf-cookie");

      // 2. API Login
      const response = await axiosClient.post("/api/login", {
        email,
        password,
      });

      // 3. Proses Sukses
      const { access_token, user } = response.data;

      if (access_token) {
        // Simpan ke localStorage melalui hook
        login(access_token, user);
        
        // REVISI LOGIKA REDIRECT:
        // Gunakan window.location.href agar Navbar melakukan hard-refresh 
        // dan membaca state 'user' terbaru dari localStorage.
        setTimeout(() => {
          const targetPath = redirectTo ? decodeURIComponent(redirectTo) : "/";
          window.location.href = targetPath;
        }, 100);

      } else {
        throw new Error("Token tidak ditemukan.");
      }

    } catch (err: any) {
      console.error("Login API Error:", err);
      let errorMessage = "Email atau Kata Sandi salah.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = err.response.data?.message || "Kredensial tidak valid.";
        } else if (err.response.status === 419) {
          errorMessage = "Sesi kedaluwarsa. Silakan segarkan halaman.";
        } else {
          errorMessage = `Server Error (${err.response.status}).`;
        }
      } else if (err.code === "ERR_NETWORK") {
        errorMessage = "Koneksi terputus ke server Backend.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 animate-fadeIn ${error ? 'animate-shake' : ''}`}
    >
      {/* Pesan Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm transition-all">
          {error}
        </div>
      )}

      {/* Input Email */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Alamat Email</label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15406A] transition-colors" size={18} />
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-[#15406A] outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Input Password */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">Kata Sandi</label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#15406A] transition-colors" size={18} />
          <input
            type="password"
            placeholder="Masukkan kata sandi Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-[#15406A] outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Fitur Tambahan */}
      <div className="flex justify-between items-center text-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="w-4 h-4 rounded border-gray-300 text-[#15406A] focus:ring-[#15406A]"
          />
          Ingat saya
        </label>

        <button
          type="button"
          className="text-[#15406A] font-medium hover:underline transition"
        >
          Lupa kata sandi?
        </button>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2
        ${loading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-[#15406A] hover:bg-[#0d2a47] active:scale-[0.98] shadow-[#15406A]/20"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Memverifikasi...</span>
          </>
        ) : (
          "Masuk"
        )}
      </button>
    </form>
  );
}