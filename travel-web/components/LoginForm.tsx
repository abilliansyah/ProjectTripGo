// components/LoginForm.tsx
"use client"; 

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/UseAuth';

// Ambil URL Base API dari .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth(); // Ambil fungsi login dan status
  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
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
      const response = await axios.post(`${API_BASE_URL}/api/login`, formData);
      
      const { access_token, user } = response.data;
      
      // Panggil fungsi login dari AuthContext
      login(access_token, user); 
      
      setMessage(`Login berhasil! Selamat datang, ${user.first_name}.`);
      router.push('/dashboard'); 

    } catch (error) {
      setIsSubmitting(false);
      if (axios.isAxiosError(error) && error.response) {
        // Tampilkan pesan error dari Laravel
        const errorMessage = error.response.data.message || 'Gagal login. Periksa email dan password Anda.';
        setMessage(`Error: ${errorMessage}`);
      } else {
        setMessage('Terjadi kesalahan jaringan atau CORS.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Login ke TripGo</h2>
      
      <div>
        <label>Alamat Email</label>
        <input type="email" name="email" placeholder="Masukkan Alamat Email" onChange={handleChange} required disabled={isSubmitting} />
      </div>

      <div>
        <label>Kata Sandi</label>
        <input type="password" name="password" placeholder="Masukkan Kata Sandi" onChange={handleChange} required disabled={isSubmitting} />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Memproses...' : 'Masuk'}
      </button>

      <p style={{ color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>
        {message}
      </p>
    </form>
  );
}