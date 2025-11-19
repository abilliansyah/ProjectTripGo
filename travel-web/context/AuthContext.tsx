// context/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import axios from 'axios';

// Definisikan Tipe Data User
interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone_number: string;
  role: 'user' | 'admin';
}

// Definisikan Tipe Data Context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// Nilai default context
const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AuthProviderProps {
  children: ReactNode;
}

// --- Kunci Local Storage yang Diperlukan ---
const TOKEN_KEY = 'authToken'; // Kunci yang Anda gunakan
const USER_DATA_KEY = 'userProfileData'; // Kunci BARU untuk menyimpan objek user
// ------------------------------------------

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk validasi token ke API /api/user.
  // Ini memastikan token yang tersimpan di browser masih valid.
  const validateAndFetchUser = useCallback(async (token: string) => {
    try {
      // console.log('AuthContext: Validating token via API /api/user...');
      const response = await axios.get<User>(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const freshUserData = response.data;
      setUser(freshUserData); 
      // Update cache user data (opsional, untuk memastikan data selalu baru)
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(freshUserData));
      
    } catch (error) {
      console.error('AuthContext: Token expired atau tidak valid. Sesi dihapus.', error);
      // Jika token tidak valid, hapus semua data lokal
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    } finally {
      setIsLoading(false); // Proses inisialisasi selesai, UI siap
    }
  }, []);

  // Inisialisasi Sesi: Membaca cache user data untuk rehidrasi cepat.
  useEffect(() => {
    if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_DATA_KEY);
    
    if (token && storedUser) {
        try {
            const userDataFromCache = JSON.parse(storedUser) as User;
            
            // --- FIX UTAMA: Set state user segera dari cache ---
            setUser(userDataFromCache);
            
            // Lanjutkan validasi token di latar belakang. 
            // isLoading akan tetap 'true' sampai API validasi selesai.
            validateAndFetchUser(token); 

        } catch (e) {
            console.error('AuthContext: Gagal membaca data user dari cache, mereset sesi.', e);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            setUser(null);
            setIsLoading(false);
        }

    } else {
      setIsLoading(false); // Selesai loading jika tidak ada token/data
    }
  }, [validateAndFetchUser]); // Menambahkan validateAndFetchUser ke dependencies

  // Fungsi Login: Simpan token dan user data ke localStorage
  const login = (token: string, userData: User) => {
    // Simpan kedua data: token dan objek user
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    setUser(userData);
    // Pastikan status loading di-reset segera setelah login berhasil
    setIsLoading(false); 
  };

  // Fungsi Logout
  const logout = () => {
    // Panggil endpoint logout di Laravel (opsional, tapi disarankan)
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        axios.post(`${API_BASE_URL}/api/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error('Logout API failed:', err));
    }
    
    // Hapus data lokal dan reset state
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY); // Hapus data user dari cache
    setUser(null);
  };

  const isAuthenticated = !!user;

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};