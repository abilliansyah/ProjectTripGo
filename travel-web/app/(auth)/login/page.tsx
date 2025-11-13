"use client";

import React, { useState, FormEvent, useEffect } from "react"; // <-- PERBAIKAN: Import useEffect di sini
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext"; 

export default function LoginPage() {
  const { login, isLoading: isAuthenticating } = useAuth(); 
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
      
    } catch (err: any) {
      // Error sudah di-handle dan di-alert di AuthContext, tetapi kita juga tampilkan di form
      if (err.message.includes('Login gagal')) {
          setError("Kredensial salah. Silakan periksa email dan password Anda.");
      } else {
          setError(err.message || "Terjadi kesalahan saat otentikasi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tambahkan efek untuk redirect jika user sudah login (pencegahan)
  const { user, isLoading } = useAuth();
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


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">TripGo Login</h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 
              ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
          >
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Lupa password? 
          <a href="#" className="text-blue-600 hover:underline ml-1">Klik di sini</a>
        </p>
      </div>
    </div>
  );
}