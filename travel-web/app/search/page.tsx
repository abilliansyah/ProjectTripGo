'use client';

import React from 'react';
// Anda mungkin akan menggunakan useSearchParams di sini nanti
// import { useSearchParams } from 'next/navigation';

// Halaman placeholder sederhana untuk hasil pencarian.
export default function SearchPage() {
  // const searchParams = useSearchParams();
  // const from = searchParams.get('from');
  // const to = searchParams.get('to');
  // const date = searchParams.get('date');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hasil Pencarian</h1>
      {/* <p className="text-xl text-gray-700 mb-4">
          Menampilkan perjalanan dari <strong>{from}</strong> ke <strong>{to}</strong> pada <strong>{date}</strong>
        </p> 
      */}

      <div className="space-y-4">
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-blue-600">
            Travel A - 08:00
          </h2>
          <p className="text-gray-700">Jakarta → Bandung</p>
          <p className="text-lg font-bold text-gray-900 mt-2">Rp 120.000</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold text-blue-600">
            Travel B - 09:00
          </h2>
          <p className="text-gray-700">Jakarta → Bandung</p>
          <p className="text-lg font-bold text-gray-900 mt-2">Rp 130.000</p>
        </div>
      </div>
    </div>
  );
}