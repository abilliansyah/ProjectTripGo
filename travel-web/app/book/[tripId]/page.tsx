'use client';

import { useParams } from 'next/navigation';
import React from 'react';

// Ini adalah contoh halaman untuk rute dinamis.
// Kita menggunakan hook 'useParams' untuk mendapatkan [tripId] dari URL.
export default function BookTripPage() {
  const params = useParams();
  const tripId = params.tripId; // Ini akan berisi ID dari URL

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Halaman Pemesanan</h1>
      <p className="text-lg text-gray-700 mb-2">
        Anda sedang memesan tiket untuk Trip ID:
      </p>
      <pre className="bg-gray-100 p-4 rounded-md text-xl font-mono text-blue-600">
        {tripId}
      </pre>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Formulir Penumpang</h2>
        <p className="text-gray-600 mt-2">
          (Formulir untuk mengisi data penumpang akan ada di sini...)
        </p>
        {/* Placeholder untuk formulir */}
      </div>
    </div>
  );
}