'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
// Import ikon (Contoh menggunakan react-icons, pastikan Anda telah menginstal 'react-icons')
import { Mail, Lock } from 'lucide-react'; // Atau ikon dari library lain, misalnya react-icons/md/MdMailOutline, dll.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!API_BASE_URL) {
      setError('Error: NEXT_PUBLIC_API_BASE_URL tidak terdefinisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data.data;
      login(token, user);
      router.push('/dashboard');

    } catch (err: any) {
      // Penanganan error...
      setError('Login gagal. Silakan cek kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Input Email */}
      <div className="relative">
        <label htmlFor="email" className="sr-only">Alamat Email</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          placeholder="Masukkan Alamat Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Input Password */}
      <div className="relative">
        <label htmlFor="password" className="sr-only">Kata Sandi</label>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          placeholder="Masukkan Kata Sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Opsi Ingat Saya & Lupa Sandi */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Ingat saya
          </label>
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            lupa kata sandi?
          </a>
        </div>
      </div>

      {/* Tombol Masuk */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-[#294B69] hover:bg-[#1f3750] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition duration-150 shadow-md`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="ml-2">Memproses...</span>
            </div>
          ) : (
            'Masuk'
          )}
        </button>
      </div>
    </form>
  );
}