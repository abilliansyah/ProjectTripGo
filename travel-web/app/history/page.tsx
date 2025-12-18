"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient"; // Gunakan axiosClient yang sama dengan Reservasi
import { Ticket, ArrowRight, Loader2 } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Menggunakan axiosClient agar token otomatis terlampir di header Authorization
      const response = await axiosClient.get("/my-history");
      
      // Menangani struktur data Laravel (result.data atau result.data.data)
      const result = response.data.data || response.data;
      setHistory(Array.isArray(result) ? result : []);
      
    } catch (err: any) {
      console.error("Gagal mengambil history:", err);
      if (err.response?.status === 401) {
        // Jika token tidak valid, arahkan ke login
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 font-poppins">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl text-blue-900 mb-8 font-medium">
          Riwayat Transaksi
        </h1>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : history.length > 0 ? (
            history.map((item: any) => (
              <div 
                key={item.order_id || item.id} 
                onClick={() => router.push(`/tiket-saya/${item.order_id}`)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 transition cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                    <h3 className="text-gray-800 font-medium">{item.order_id}</h3>
                  </div>
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-medium uppercase ${
                    item.status === 'settlement' || item.status === 'success' || item.status === 'paid'
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Rute Perjalanan</p>
                    <div className="text-blue-900 text-sm flex items-center gap-2">
                      {item.schedule?.origin || 'Unknown'} <ArrowRight size={12} /> {item.schedule?.destination || 'Unknown'}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-gray-800 font-medium">
                      IDR {Number(item.total_amount || item.price || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
               <Ticket className="mx-auto text-gray-200 mb-4" size={48} />
               <p className="text-gray-400 text-sm">Belum ada riwayat pesanan.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}