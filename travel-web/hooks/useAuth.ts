// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // Peringatan jika hook digunakan di luar provider
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Mengembalikan semua state dan fungsi dari context
  return context;
};