// Menghapus 'use client' agar menjadi Server Component
// Menghapus import 'useParams' yang menyebabkan error build
import React from 'react';

// Halaman rute dinamis lainnya untuk pembayaran.
// Kita mendapatkan 'params' sebagai prop, BUKAN dari hook 'useParams'.
export default function PaymentPage({
  params,
}: {
  params: { bookingCode: string };
}) {
  const bookingCode = params.bookingCode; // Didapat dari prop

  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Selesaikan Pembayaran
        </h1>
        <p className="text-lg text-gray-700 mb-4 text-center">
          Kode Booking Anda:
        </p>
        <pre className="bg-gray-100 p-4 rounded-md text-2xl font-mono text-center text-red-600 mb-6">
          {bookingCode}
        </pre>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center">
            Total: Rp 150.000
          </h2>
          <p className="text-gray-600 mt-4 text-center">
            (Opsi pembayaran seperti Virtual Account, Midtrans, dll. akan
            muncul di sini...)
          </p>
          {/* Tombol ini dinonaktifkan sementara. 
            Karena ini Server Component, interaktivitas (onClick) 
            harus dipindahkan ke Client Component terpisah nanti. 
            Ini dilakukan untuk memperbaiki error build.
          */}
          <button
            disabled
            className="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}