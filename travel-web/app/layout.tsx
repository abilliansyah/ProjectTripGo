// app/layout.tsx

import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Bungkus seluruh aplikasi dengan AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}