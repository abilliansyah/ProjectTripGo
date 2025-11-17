// context/AuthContext.tsx
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk mengambil data user dari API Laravel
  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // response.data sudah disesuaikan dengan interface User
      setUser(response.data as User); 
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Jika token tidak valid, hapus token
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false); // Selesai loading jika tidak ada token
    }
  }, []);

  // Fungsi Login: Dipanggil setelah register/login berhasil di form
  const login = (token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  // Fungsi Logout
  const logout = () => {
    // Panggil endpoint logout di Laravel (opsional, tapi disarankan)
    const token = localStorage.getItem('authToken');
    if (token) {
        axios.post(`${API_BASE_URL}/api/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(err => console.error('Logout API failed:', err));
    }
    
    // Hapus data lokal dan reset state
    localStorage.removeItem('authToken');
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