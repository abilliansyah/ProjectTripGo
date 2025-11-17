'use client';

import { AuthProvider } from '@/lib/AuthContext';
import React from 'react';

// Layout ini akan mengelilingi semua rute di dalam (auth)
// Ini menjamin bahwa LoginPage (anaknya) memiliki akses ke AuthProvider.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}