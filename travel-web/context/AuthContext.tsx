"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
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

// Pastikan API_BASE_URL sudah didefinisikan di .env.local atau .env
// Jika Anda tidak menggunakan Next.js/process.env, ganti dengan string URL langsung.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface AuthProviderProps {
  children: ReactNode;
}

// --- Kunci Local Storage yang Diperlukan ---
const TOKEN_KEY = 'authToken'; 
const USER_DATA_KEY = 'userProfileData'; 
// ------------------------------------------

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  // Status loading harus true di awal untuk menunggu proses rehidrasi selesai
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk validasi token ke API /api/user.
  const validateAndFetchUser = useCallback(async (token: string) => {
    // console.log('AuthContext: Validating token via API /api/user...');
    try {
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
      // PENTING: Set isLoading ke false HANYA setelah API validasi selesai
      // Ini menyelesaikan masalah loading tak henti.
      setIsLoading(false); 
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
            
            // Rehidrasi Cepat (mengatasi masalah tampilan/CLS)
            setUser(userDataFromCache);
            
            // Lanjutkan validasi token di latar belakang.
            // isLoading tetap 'true' sampai API validasi selesai.
            validateAndFetchUser(token); 

        } catch (e) {
            console.error('AuthContext: Gagal membaca data user dari cache, mereset sesi.', e);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            setUser(null);
            setIsLoading(false); // Selesai loading karena sesi bermasalah
        }

    } else {
      setIsLoading(false); // Selesai loading jika tidak ada token/data
    }
  }, [validateAndFetchUser]); 

  // Fungsi Login: Simpan token dan user data ke localStorage
  const login = (token: string, userData: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    setUser(userData);
    setIsLoading(false); 
  };

  // Fungsi Logout
  const logout = () => {
    // Panggil endpoint logout di API (opsional, tapi disarankan)
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        axios.post(`${API_BASE_URL}/api/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error('Logout API failed:', err));
    }
    
    // Hapus data lokal dan reset state
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};