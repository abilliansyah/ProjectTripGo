import React from 'react';

// Semua file layout WAJIB mengekspor (export)
// komponen default yang menerima properti 'children'.
// 'children' ini adalah file page.tsx Anda (seperti my-bookings/page.tsx)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Placeholder untuk Sidebar Dashboard */}
      <aside className="w-60 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
        <nav className="space-y-4">
          <a
            href="/dashboard/my-bookings"
            className="block text-lg text-blue-600 font-medium hover:underline"
          >
            My Bookings
          </a>
          <a
            href="#"
            className="block text-lg text-gray-600 hover:underline"
          >
            Profile
          </a>
          <a
            href="#"
            className="block text-lg text-gray-600 hover:underline"
          >
            Settings
          </a>
        </nav>
      </aside>

      {/* Konten Halaman (page.tsx akan dirender di sini) */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}