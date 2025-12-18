'use client';

import React, { useState } from 'react';
import axiosClient from '@/utils/axiosClient'; 
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, LucideIcon, Loader2 } from 'lucide-react'; 

// --- Interface untuk Komponen InputField ---
interface InputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password';
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon; 
  required?: boolean;
}

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 1. Validasi Sederhana
    if (!agreeToTerms) {
      setError('Anda harus menyetujui kebijakan privasi untuk mendaftar.');
      setLoading(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      // 2. Inisialisasi CSRF (PENTING!)
      // Jalankan ini tanpa prefix /api jika rute sanctum Anda di luar /api
      // Jika error, coba ganti ke axiosClient.get('/sanctum/csrf-cookie')
      await axiosClient.get('https://projecttripgo-production-1bec.up.railway.app/sanctum/csrf-cookie');

      // 3. Kirim Data Registrasi
      await axiosClient.post('/register', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess('Pendaftaran berhasil! Mengalihkan ke halaman Masuk...');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      console.error('Full Error Object:', err);
      
      if (err.response?.status === 419) {
        setError('Masalah Keamanan (CSRF Mismatch). Silakan refresh halaman atau cek koneksi backend.');
      } else if (err.response?.status === 422) {
        // Gabungkan pesan error validasi dari Laravel
        const validationErrors = err.response.data.errors;
        const msg = Object.values(validationErrors).flat().join(', ');
        setError(`Validasi gagal: ${msg}`);
      } else {
        setError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 whitespace-pre-wrap px-4 py-3 rounded-lg relative text-sm animate-in fade-in slide-in-from-top-2" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg relative text-sm animate-in fade-in slide-in-from-top-2" role="alert">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <InputField 
          id="first_name" 
          label="Nama Depan" 
          placeholder="Nama Depan" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          icon={User}
        />
        <InputField 
          id="last_name" 
          label="Nama Belakang" 
          placeholder="Nama Belakang" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          icon={User}
        />
      </div>

      <InputField 
        id="email" 
        label="Alamat Email" 
        type="email" 
        placeholder="nama@email.com" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        icon={Mail}
      />
      
      <InputField 
        id="phone" 
        label="Nomor Telepon" 
        type="tel" 
        placeholder="0812xxxx" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        icon={Phone}
      />

      <InputField 
        id="password" 
        label="Kata Sandi" 
        type="password" 
        placeholder="Min. 8 karakter" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        icon={Lock}
      />
      
      <InputField 
        id="password_confirmation" 
        label="Konfirmasi Kata Sandi" 
        type="password" 
        placeholder="Ulangi kata sandi" 
        value={passwordConfirmation} 
        onChange={(e) => setPasswordConfirmation(e.target.value)} 
        icon={Lock}
      />
      
      <div className="flex items-start pt-1">
        <div className="flex items-center h-5">
            <input
            id="agree-to-terms"
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