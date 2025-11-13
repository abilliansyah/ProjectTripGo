// lib/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- Definisi Tipe Simulasi ---
export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  email: string; // Pastikan ini sudah ada
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // BARIS INI HARUS ADA DAN BENAR:
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter(); // Pastikan router dideklarasikan jika digunakan

  // SIMULASI: Cek token/session saat inisialisasi
  useEffect(() => {
    // ... (logic Anda)
    // Di sini Anda menggunakan setUser dan setIsLoading
    const token = localStorage.getItem('authToken');
    if (token) {
      setUser({ id: 1, name: 'Admin User', role: 'admin', email: 'admin@example.com' });
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setUser({ 
      id: 1, 
      name: 'Admin User', 
      role: 'admin',
      email: 'admin@example.com' 
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    router.push('/login'); // Redirect setelah logout
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom untuk memudahkan penggunaan context
export const useAuth = () => {
  // ... (logic hook)
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};