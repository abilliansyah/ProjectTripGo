// app/layout.tsx

import React from 'react';

// Tipe untuk Props Layout (children)
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>TripGo</title>
        {/* Tambahkan tag meta lain di sini */}
      </head>
      <body>
        {/* CHILDREN di sini akan merender semua rute lainnya, termasuk AuthLayout dan LoginPage */}
        {children} 
      </body>
    </html>
  );
}