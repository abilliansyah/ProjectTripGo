// components/RegisterForm.tsx
"use client"; 

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth(); // Ambil fungsi login dan status
  
  const [formData, setFormData] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    phone_number: '', 
    password: '', 
    password_confirmation: '' // Wajib untuk validasi 'confirmed' di Laravel
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Jika sudah login, redirect langsung
  if (isAuthenticated) {
    router.push('/dashboard');
    return null; 
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Processing...');
    
    try {
      // Endpoint register di Laravel
      const response = await axios.post(`${API_BASE_URL}/api/register`, formData);
      
      const { access_token, user } = response.data;
      
      // Panggil fungsi login dari AuthContext (user otomatis login setelah register)
      login(access_token, user); 
      
      setMessage('Registrasi berhasil! Anda akan diarahkan ke dashboard.');
      router.push('/dashboard'); 

    } catch (error) {
      setIsSubmitting(false);
      if (axios.isAxiosError(error) && error.response) {
        const errors = error.response.data.errors;
        let errorMessage = 'Gagal mendaftar.';
        
        // Menampilkan pesan error validasi yang detail dari Laravel
        if (errors) {
            errorMessage = Object.values(errors).flat().join(' | ');
        } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        setMessage(`Error: ${errorMessage}`);
        
      } else {
        setMessage('Terjadi kesalahan jaringan atau CORS.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        maxWidth: '600px', 
        margin: '50px auto', 
        padding: '30px', 
        border: '1px solid #ddd', 
        borderRadius: '8px' 
    }}>
      <h2 style={{ gridColumn: 'span 2' }}>Silakan Buat Akun!</h2>
      <p style={{ gridColumn: 'span 2' }}>Buat akun TripGo sebelum memulai perjalanan</p>

      {/* Nama Depan & Belakang */}
      <div>
        <label>Nama Depan</label>
        <input type="text" name="first_name" placeholder="Nama Depan Anda" onChange={handleChange} required disabled={isSubmitting} />
      </div>
      <div>
        <label>Nama Belakang</label>
        <input type="text" name="last_name" placeholder="Nama Belakang Anda" onChange={handleChange} disabled={isSubmitting} />
      </div>

      {/* Email */}
      <div style={{ gridColumn: 'span 2' }}>
        <label>Alamat Email</label>
        <input type="email" name="email" placeholder="Masukkan Alamat Email" onChange={handleChange} required disabled={isSubmitting} />
      </div>

      {/* Nomor Telepon */}
      <div style={{ gridColumn: 'span 2' }}>
        <label>Nomor Telepon</label>
        <input type="tel" name="phone_number" placeholder="Masukkan Nomor Telepon" onChange={handleChange} required disabled={isSubmitting} />
      </div>

      {/* Kata Sandi */}
      <div style={{ gridColumn: 'span 2' }}>
        <label>Kata Sandi</label>
        <input type="password" name="password" placeholder="Masukkan Kata Sandi" onChange={handleChange} required disabled={isSubmitting} />
      </div>
      
      {/* Konfirmasi Kata Sandi */}
      <div style={{ gridColumn: 'span 2' }}>
        <label>Konfirmasi Kata Sandi</label>
        <input type="password" name="password_confirmation" placeholder="Masukkan Ulang Kata Sandi" onChange={handleChange} required disabled={isSubmitting} />
      </div>

      <button type="submit" style={{ gridColumn: 'span 2' }} disabled={isSubmitting}>
        {isSubmitting ? 'Memproses...' : 'Buat Akun'}
      </button>
      
      <p style={{ gridColumn: 'span 2', color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>
        {message}
      </p>
    </form>
  );
}