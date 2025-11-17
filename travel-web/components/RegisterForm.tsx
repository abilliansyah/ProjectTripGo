import React, { useState } from 'react';
import axios from 'axios';
// Import routing dihapus karena menyebabkan error "Could not resolve"

// Import ikon dari lucide-react
import { Mail, Phone, Lock, ChevronRight, User } from 'lucide-react'; 

// Dapatkan base URL dari environment variable.
// Jika environment tidak mendukung process.env (seperti dalam simulator ini),
// kita menggunakan placeholder. Anda harus mengganti 'https://api.example.com' 
// dengan URL API Anda yang sebenarnya agar pendaftaran berfungsi.
const API_BASE_URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL 
  ? process.env.NEXT_PUBLIC_API_BASE_URL 
  : 'https://api.example.com'; // Placeholder URL

export default function TripGoRegisterPage() {
  // State untuk input formulir
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // State untuk feedback API
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // useRouter dihapus untuk menghindari error resolve

  // --- Komponen Input Field dengan Ikon (Refactored untuk Styling Baru) ---
  const InputField: React.FC<{
    id: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'password';
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    Icon: React.ElementType; // Menggunakan React.ElementType untuk komponen Lucide
  }> = ({ id, label, type, placeholder, value, onChange, Icon }) => (
    <div>
      <label htmlFor={id} className="block text-slate-700 font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm text-slate-900"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
  // --- Akhir Komponen Input Field ---


  // --- Fungsi Penanganan Submit Form (Logika API) ---
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

    // Periksa apakah API_BASE_URL masih menggunakan placeholder
    if (API_BASE_URL === 'https://api.example.com') {
      setError('Error: API_BASE_URL adalah placeholder. Mohon ganti dengan URL API Anda yang sebenarnya.');
      setLoading(false);
      return;
    }


    try {
      // Data dikirim ke API dengan format snake_case
      await axios.post(`${API_BASE_URL}/register`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess('Pendaftaran berhasil! Anda akan dialihkan ke halaman Masuk.');
      
      setTimeout(() => {
        // Menggunakan window.location.href sebagai solusi fallback routing
        window.location.href = '/login'; 
      }, 2000);

    } catch (err: any) {
      // Penanganan error dari respons API
      const errorMessage = err.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // --- Akhir Fungsi Penanganan Submit Form ---

  return (
    // Background dengan gradien yang baru
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 font-sans">
      
      {/* Navigation Bar (Sesuai Desain Baru) */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo/Nama Aplikasi */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-white transform rotate-45" />
              </div>
              <span className="text-2xl font-bold text-slate-800">TripGo</span>
              <span className="text-xs text-slate-500 hidden sm:inline">your favorite travel</span>
            </div>
                        
            {/* Menu Navigasi */}
            <div className="flex items-center space-x-4 md:space-x-8">
              <a href="#" className="text-slate-700 hover:text-blue-600 font-medium hidden sm:inline">Beranda</a>
              <a href="#" className="text-slate-700 hover:text-blue-600 font-medium hidden sm:inline">Reservasi</a>
              <a href="#" className="text-slate-700 hover:text-blue-600 font-medium hidden md:inline">Kontak</a>
              <a href="/login">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md">
                  Daftar/Masuk
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Registration Form Container */}
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-100">
          
          {/* Header Card */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Silakan Buat Akun!</h1>
            <p className="text-slate-600">Buat akun TripGo sebelum memulai perjalanan</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Area Feedback (Error/Success) */}
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

            {/* Nama Depan & Belakang */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-slate-700 font-medium mb-2">Nama Depan</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                  placeholder="Nama Depan Anda"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-slate-700 font-medium mb-2">Nama Belakang</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
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
              placeholder="Masukan Alamat Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              Icon={Mail}
            />
            
            {/* Nomor Telepon */}
            <InputField 
              id="phone" 
              label="Nomor Telepon" 
              type="tel" 
              placeholder="Masukan Nomor Telepon" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              Icon={Phone}
            />

            {/* Kata Sandi */}
            <InputField 
              id="password" 
              label="Kata Sandi" 
              type="password" 
              placeholder="Masukan Kata Sandi" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              Icon={Lock}
            />
            
            {/* Konfirmasi Kata Sandi */}
            <InputField 
              id="passwordConfirmation" 
              label="Konfirmasi Kata Sandi" 
              type="password" 
              placeholder="Masukan Ulang Kata Sandi" 
              value={passwordConfirmation} 
              onChange={(e) => setPasswordConfirmation(e.target.value)} 
              Icon={Lock}
            />
            
            {/* Checkbox Persetujuan */}
            <div className="flex items-start pt-2">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-slate-600">
                saya setuju dengan <a href="#" className="font-medium text-blue-600 hover:text-blue-700">kebijakan privasi</a>
              </label>
            </div>

            {/* Tombol Daftar */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !agreeToTerms}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white transition duration-200 shadow-lg ${
                  (loading || !agreeToTerms) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
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
            <div className="text-center mt-6">
              <p className="text-slate-600">
                Sudah punya akun?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Masuk disini
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}