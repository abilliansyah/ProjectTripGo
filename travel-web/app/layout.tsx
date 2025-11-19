import React, { ReactNode } from 'react';
// PERBAIKAN: Mengganti './components/Navbar' menjadi '../components/Navbar'
import Navbar from '../components/Navbar'; 
// PERBAIKAN: Mengganti './context/AuthContext' menjadi '../context/AuthContext'
import { AuthProvider } from '../context/AuthContext'; 

// Asumsi ada file global.css untuk Tailwind CSS
// Import global.css jika ada, atau tambahkan styling di sini.

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="id">
      <head>
        <title>TripGo | Platform Perjalanan Modern</title>
        {/* Load Tailwind CSS from CDN for simplicity in single-file React */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Tambahkan konfigurasi font Inter jika diperlukan */}
        <style>{`
          body { font-family: 'Inter', sans-serif; }
        `}</style>
      </head>
      <body>
        {/* AuthProvider membungkus seluruh aplikasi */}
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            {/* Anda bisa menambahkan Footer di sini jika ada */}
            {/* <Footer /> */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;