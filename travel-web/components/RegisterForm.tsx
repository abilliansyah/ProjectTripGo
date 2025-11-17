'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// Import ikon dari lucide-react
import { User, Mail, Phone, Lock, LucideIcon } from 'lucide-react'; // Menambahkan LucideIcon untuk tipe

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
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => { // Menggunakan tipe eksplisit React.FormEvent
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
    
    if (!API_BASE_URL) {
      setError('Error: NEXT_PUBLIC_API_BASE_URL tidak terdefinisi.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess('Pendaftaran berhasil! Anda akan dialihkan ke halaman Masuk.');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      // Penanganan error...
      setError('Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Komponen pembantu untuk input field, sekarang dengan tipe props yang jelas
  const InputField: React.FC<InputFieldProps> = ({ id, label, type = 'text', placeholder, value, onChange, icon: Icon, required = true }) => (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && ( // Render ikon hanya jika ada
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className={`appearance-none block w-full ${Icon ? 'pl-10 pr-3' : 'px-3'} py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
          {success}
        </div>
      )}

      {/* Nama Depan & Belakang - Berdampingan (Tidak menggunakan InputField helper karena tidak ada ikon) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Nama Depan */}
        <div className="space-y-1">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nama Depan</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
            placeholder="Nama Depan Anda"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        {/* Nama Belakang */}
        <div className="space-y-1">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nama Belakang</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
            placeholder="Nama Belakang Anda"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <InputField 
        id="email" 
        label="Alamat Email" 
        type="email" 
        placeholder="Masukkan Alamat Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        icon={Mail}
      />
      
      {/* Nomor Telepon */}
      <InputField 
        id="phone" 
        label="Nomor Telepon" 
        type="tel" 
        placeholder="Masukkan Nomor Telepon" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        icon={Phone}
      />

      {/* Kata Sandi */}
      <InputField 
        id="password" 
        label="Kata Sandi" 
        type="password" 
        placeholder="Masukkan Kata Sandi" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        icon={Lock}
      />
      
      {/* Konfirmasi Kata Sandi */}
      <InputField 
        id="password_confirmation" 
        label="Konfirmasi Kata Sandi" 
        type="password" 
        placeholder="Masukkan Ulang Kata Sandi" 
        value={passwordConfirmation} 
        onChange={(e) => setPasswordConfirmation(e.target.value)} 
        icon={Lock}
      />
      
      {/* Checkbox Persetujuan */}
      <div className="flex items-center pt-2">
        <input
          id="agree-to-terms"
          name="agree-to-terms"
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="agree-to-terms" className="ml-2 block text-sm text-gray-900">
          saya setuju dengan <a href="#" className="font-medium text-blue-600 hover:text-blue-500">kebijakan privasi</a>
        </label>
      </div>

      {/* Tombol Daftar */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || !agreeToTerms}
          className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white ${
            (loading || !agreeToTerms) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#294B69] hover:bg-[#1f3750] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition duration-150 shadow-md`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="ml-2">Mendaftar...</span>
            </div>
          ) : (
            'Daftar'
          )}
        </button>
      </div>

      {/* Link Masuk */}
      <div className="text-center">
          <p className="text-sm text-gray-600">
            sudah punya akun? {' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              masuk disini
            </a>
          </p>
        </div>
    </form>
  );
}