"use client";

import React, { useState, FormEvent, CSSProperties } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance'; // Sesuaikan path jika perlu
// Sesuaikan path jika perlu

// Interface dan Styles (Dipotong untuk kerapian, masukkan kode lengkap dari respon sebelumnya)
// ... (Masukkan interface LoginResponse)
// ... (Masukkan objek styles lengkap)

// Tipe Respons
interface LoginResponse {
  message: string;
  access_token: string; 
  token_type: string;
  user?: any; 
}

// Styles (Dipotong, masukkan versi lengkap)
const styles: Record<string, CSSProperties> = { 
  card: { maxWidth: '400px', width: '100%', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', backgroundColor: 'white' },
  title: { textAlign: 'center', color: '#1a202c', marginBottom: '20px', fontSize: '1.8rem' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '8px', fontWeight: '600', color: '#4a5568' },
  input: { padding: '12px', marginBottom: '20px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '1rem' },
  button: { padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.3s' },
  error: { color: '#e53e3e', textAlign: 'center', marginBottom: '15px', padding: '10px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '6px' }
};

export default function LoginPage(): React.ReactNode {
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      const response = await axiosInstance.post<LoginResponse>('/login', {
        email: email,
        password: password,
      });

      const { access_token } = response.data;

      if (access_token) {
        localStorage.setItem('auth_token', access_token); 
        router.push('/dashboard'); 
      } else {
        setError('Login berhasil, tapi server tidak mengembalikan token.');
      }

    } catch (err: unknown) { 
      if (axios.isAxiosError(err) && err.response) { 
        const axiosError = err as AxiosError<{ message: string }>; 
        const errorMessage = axiosError.response?.data?.message || 'Kredensial tidak valid.';
        setError(errorMessage);
      } else {
        setError('Gagal terhubung ke API. Cek status Vercel/Railway.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Masuk ke Akun Anda</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        
        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label} htmlFor="email">Alamat Email</label>
        <input
          style={styles.input}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label style={styles.label} htmlFor="password">Password</label>
        <input
          style={styles.input}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button 
          style={styles.button} 
          type="submit" 
          disabled={loading}>
          {loading ? 'Memproses Login...' : 'Login Sekarang'}
        </button>
      </form>
    </div>
  );
}