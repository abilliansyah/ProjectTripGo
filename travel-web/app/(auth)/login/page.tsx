// app/(auth)/login/page.tsx

import React, { useState, FormEvent, CSSProperties } from 'react'; 
import axios, { AxiosError } from 'axios'; 
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance'; // Ganti jika path tidak sesuai

// 1. Definisikan Tipe Respons API Login
interface LoginResponse {
  message: string;
  access_token: string; // Kunci yang mengembalikan token dari Laravel
  token_type: string;
  user?: any; 
}

// 2. Terapkan Tipe ke Objek Styles (Mengatasi Code 2322)
const styles: Record<string, CSSProperties> = { 
  container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#333' },
  form: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: '5px', fontWeight: 'bold' },
  input: { padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' },
  button: { padding: '10px', backgroundColor: '#5c67f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', textAlign: 'center', marginBottom: '10px', border: '1px solid #fdd', padding: '10px', backgroundColor: '#fee' }
};

export default function LoginPage(): React.ReactNode {
  // Terapkan Tipe ke State
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  // 3. Terapkan Tipe FormEvent (Mengatasi Code 7006)
  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      // Panggil endpoint login menggunakan instance Axios
      const response = await axiosInstance.post<LoginResponse>('/login', {
        email: email,
        password: password,
      });

      const { access_token } = response.data;

      if (access_token) {
        // Simpan token untuk otentikasi selanjutnya
        localStorage.setItem('auth_token', access_token); 
        router.push('/dashboard'); // Ganti dengan rute dashboard Anda
      } else {
        setError('Login berhasil, tapi server tidak mengembalikan token.');
      }

    } catch (err: unknown) { // 4. Tangani Error 'unknown' (Mengatasi Code 18046)
      
      if (axios.isAxiosError(err) && err.response) { 
        // Tangani error yang berasal dari server (misalnya 401, 422)
        const axiosError = err as AxiosError<{ message: string }>; 
        const errorMessage = axiosError.response?.data?.message || 'Kredensial tidak valid.';
        setError(errorMessage);
      } else {
        // Tangani error jaringan (API tidak bisa dijangkau)
        setError('Gagal terhubung ke API. Cek status Vercel/Railway.');
      }
      console.error('Error Login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login BTM Travel</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        
        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label} htmlFor="email">Email:</label>
        <input
          style={styles.input}
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label} htmlFor="password">Password:</label>
        <input
          style={styles.input}
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button 
          style={styles.button} 
          type="submit" 
          disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
    </div>
  );
}