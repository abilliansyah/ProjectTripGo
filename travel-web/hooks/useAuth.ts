// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
// hooks/useAuth.ts
// hooks/useAuth.ts
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ambil data user setiap kali komponen yang memakai hook ini di-mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, logout };
};