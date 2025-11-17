'use client';

import React from 'react';

// Halaman placeholder sederhana untuk "My Bookings"
export default function MyBookingsPage() {
  // Nanti di sini Anda akan fetch data booking user
  const bookings = [
    { id: 'TRIP-123', from: 'Jakarta', to: 'Bandung', status: 'Lunas' },
    { id: 'TRIP-456', from: 'Surabaya', to: 'Yogyakarta', status: 'Menunggu Pembayaran' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Riwayat Pemesanan Saya</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="p-4 border rounded-lg shadow-sm bg-white"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              {booking.id}
            </h2>
            <p className="text-gray-700">
              {booking.from} → {booking.to}
            </p>
            <span
              className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                booking.status === 'Lunas'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}