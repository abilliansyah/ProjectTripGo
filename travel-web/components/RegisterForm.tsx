'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, LucideIcon, Loader2 } from 'lucide-react'; // Menambahkan LucideIcon untuk tipe

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Interface untuk Komponen InputField ---
interface InputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon; // Menggunakan tipe LucideIcon dari lucide-react
  required?: boolean;
}
// --- Akhir Interface ---

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // --- MOCK ROUTER UNTUK PREVIEW ---
  // Di project asli, hapus baris mock ini dan gunakan: const router = useRouter();
  const router = { 
    push: (path: string) => console.log(`Redirecting to ${path}...`) 
  };
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://projecttripgo-production.up.railway.app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!agreeToTerms) {
      setError('Anda harus menyetujui kebijakan privasi untuk mendaftar.');
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      setLoading(false);
      return;
    }
    
    // Validasi sederhana untuk URL API di preview
    if (!API_BASE_URL) {
       // Diabaikan di preview agar tidak error
    }

    try {
      // Simulasi request di preview jika axios gagal (karena tidak ada backend real)
      // Di production, baris axios.post di bawah ini akan berjalan normal
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      /* // UNCOMMENT KODE INI DI PROJECT ASLI:
      await axios.post(`${API_BASE_URL}/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password,
        password_confirmation: passwordConfirmation,
      });
      */

      setSuccess('Pendaftaran berhasil! Anda akan dialihkan ke halaman Masuk.');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Register Error:', err);
      setError(err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Komponen InputField
  const InputField: React.FC<InputFieldProps> = ({ 
    id, 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    icon: Icon, 
    required = true 
  }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative group">
        {Icon && ( 
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#213b55] transition-colors" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className={`appearance-none block w-full ${Icon ? 'pl-10 pr-3' : 'px-3'} py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213b55]/20 focus:border-[#213b55] sm:text-sm transition-all shadow-sm`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative text-sm animate-in fade-in slide-in-from-top-2" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative text-sm animate-in fade-in slide-in-from-top-2" role="alert">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700">Nama Depan</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213b55]/20 focus:border-[#213b55] sm:text-sm transition-all shadow-sm"
            placeholder="Nama Depan Anda"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700">Nama Belakang</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#213b55]/20 focus:border-[#213b55] sm:text-sm transition-all shadow-sm"
            placeholder="Nama Belakang Anda"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <InputField 
        id="email" 
        label="Alamat Email" 
        type="email" 
        placeholder="Masukkan Alamat Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        icon={Mail}
      />
      
      <InputField 
        id="phone" 
        label="Nomor Telepon" 
        type="tel" 
        placeholder="Masukkan Nomor Telepon" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        icon={Phone}
      />

      <InputField 
        id="password" 
        label="Kata Sandi" 
        type="password" 
        placeholder="Masukkan Kata Sandi" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        icon={Lock}
      />
      
      <InputField 
        id="password_confirmation" 
        label="Konfirmasi Kata Sandi" 
        type="password" 
        placeholder="Masukkan Ulang Kata Sandi" 
        value={passwordConfirmation} 
        onChange={(e) => setPasswordConfirmation(e.target.value)} 
        icon={Lock}
      />
      
      <div className="flex items-start pt-1">
        <div className="flex items-center h-5">
            <input
            id="agree-to-terms"
            name="agree-to-terms"
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="h-4 w-4 text-[#213b55] focus:ring-[#213b55] border-gray-300 rounded cursor-pointer"
            />
        </div>
        <label htmlFor="agree-to-terms" className="ml-2 block text-sm text-gray-600">
          saya setuju dengan <a href="#" className="font-semibold text-[#213b55] hover:underline">kebijakan privasi</a>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading || !agreeToTerms}
          className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white transition-all duration-200 shadow-md ${
            (loading || !agreeToTerms) 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-[#213b55] hover:bg-[#1a2f45] hover:shadow-lg active:scale-[0.99]'
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
               <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span>Memproses...</span>
            </div>
          ) : (
            'Daftar'
          )}
        </button>
      </div>

      <div className="text-center pb-2">
          <p className="text-sm text-gray-600">
            sudah punya akun? {' '}
            <a href="/login" className="font-bold text-[#213b55] hover:underline cursor-pointer">
              masuk disini
            </a>
          </p>
        </div>
    </form>
  );
}