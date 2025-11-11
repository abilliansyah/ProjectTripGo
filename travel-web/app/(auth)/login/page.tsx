// app/(auth)/layout.tsx

import React from 'react';

// Tipe untuk Props Layout (children)
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={authLayoutStyle}>
      {/* Anda bisa menambahkan header, footer, atau branding khusus untuk halaman 
        login/register di sini.
      */}
      
      {/* CHILDREN di sini adalah halaman login/page.tsx Anda */}
      {children} 

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        &copy; 2025 BTM Travel. All rights reserved.
      </p>
    </div>
  );
}

// Gaya minimal untuk menengahkan konten login
const authLayoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Memastikan layout memenuhi tinggi viewport
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f4f7f9'
};