// lib/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// URL dasar API diambil dari Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://projecttripgo-production.up.railway.app';
const LOGIN_ENDPOINT = `${API_URL}/v1/auth/login`; 
const USER_ENDPOINT = `${API_URL}/v1/user`; 

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
  login: (credentials: { email: string; password: string }) => Promise<void>; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  // FUNGSI INI SEKARANG MENGEMBALIKAN DATA USER YANG BARU (User | null)
  const fetchUser = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch(USER_ENDPOINT, { 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Token tidak valid');
      
      const userDataFromApi = await response.json();

      // Buat objek User yang valid
      const newUser: User = {
          id: userDataFromApi.id,
          name: userDataFromApi.name,
          email: userDataFromApi.email,
          role: userDataFromApi.role || 'user',
      }
      
      setUser(newUser); // Atur state
      return newUser; // <-- KEMBALIKAN OBJECT USER BARU
    } catch (error) {
      console.error("Gagal memvalidasi user:", error);
      localStorage.removeItem('authToken');
      setUser(null);
      return null;
    }
  };


  // --- CEK TOKEN SAAT INISIALISASI ---
  useEffect(() => {
    // Tambahkan useCallback ke fetchUser atau pindahkan logic untuk menghindari warning
    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            await fetchUser(token); // Cukup panggil tanpa perlu cek isValid lagi
        }
        setIsLoading(false);
    }
    checkAuth();
  }, []); // Dependency kosong untuk dijalankan sekali saat mount

  // --- FUNGSI LOGIN DENGAN API CALL NYATA (Logic redirect diperbaiki) ---
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
        throw new Error(data.message || 'Login gagal.');
      }

      const token = data.access_token || data.token; 
      localStorage.setItem('authToken', token);

      // Dapatkan user yang baru dan LAKUKAN REDIRECT MENGGUNAKAN DATA BARU INI
      const newUser = await fetchUser(token); // newUser adalah objek User yang valid atau null
      
      if (newUser) { 
        if (newUser.role === 'admin') { // <-- CEK MENGGUNAKAN newUser BUKAN user STATE
          router.push('/admin/dashboard'); 
        } else {
          router.push('/'); // Redirect user biasa ke halaman utama publik
        }
      } else {
          // Jika fetchUser gagal meskipun token didapat (sangat jarang, tapi aman)
          alert("Login berhasil, namun gagal mengambil data user.");
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