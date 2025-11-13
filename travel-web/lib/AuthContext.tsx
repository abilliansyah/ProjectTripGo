// lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// URL dasar API diambil dari Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://projecttripgo-production.up.railway.app';
// Sesuaikan dengan endpoint login Laravel Anda
const LOGIN_ENDPOINT = `${API_URL}/v1/auth/login`; 
const USER_ENDPOINT = `${API_URL}/v1/user`; // Endpoint untuk mendapatkan data user setelah login (jika diperlukan)

// --- Definisi Tipe User ---
export interface User { 
  id: number;
  name: string;
  role: 'admin' | 'user'; 
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>; // Login menerima kredensial
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  // --- FUNGSI UNTUK MENGAMBIL DATA USER DARI API ---
  const fetchUser = async (token: string) => {
    try {
      // Panggil endpoint untuk mendapatkan data user (biasanya /api/user di Laravel Sanctum)
      const response = await fetch(USER_ENDPOINT, { 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Token tidak valid');
      
      const userDataFromApi = await response.json();
      
      // Asumsi API mengembalikan data dalam format User (id, name, email, role)
      setUser({
          id: userDataFromApi.id,
          name: userDataFromApi.name,
          email: userDataFromApi.email,
          role: userDataFromApi.role || 'user', // Gunakan role jika tersedia
      });
      return true;

    } catch (error) {
      console.error("Gagal memvalidasi user:", error);
      localStorage.removeItem('authToken');
      setUser(null);
      return false;
    }
  };


  // --- CEK TOKEN SAAT INISIALISASI ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(token).then(isValid => {
        if (!isValid) router.push('/login');
      });
    }
    setIsLoading(false);
  }, []);

  // --- FUNGSI LOGIN DENGAN API CALL NYATA ---
  const login = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error seperti kredensial salah dari Laravel
        throw new Error(data.message || 'Login gagal.');
      }

      // Asumsi Laravel mengembalikan token di properti 'token' atau 'access_token'
      const token = data.access_token || data.token; 
      localStorage.setItem('authToken', token);

      // Ambil data user setelah token didapat (atau jika Laravel mengembalikannya langsung)
      const success = await fetchUser(token);
      
      if (success && user?.role === 'admin') { // Cek apakah pengguna yang login adalah admin
        router.push('/admin/dashboard'); 
      } else if (success) {
        // Jika user biasa login ke rute admin, arahkan ke login atau halaman user
        router.push('/'); 
      }

    } catch (error) {
      console.error("Login Error:", error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNGSI LOGOUT ---
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};