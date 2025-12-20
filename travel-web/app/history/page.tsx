"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Ticket, ArrowRight, Loader2, Clock } from "lucide-react";

// Komponen Timer Terpisah agar performa render tetap stabil
const CountdownTimer = ({ createdAt }: { createdAt: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const startTime = new Date(createdAt).getTime();
      const expiryTime = startTime + 2 * 60 * 60 * 1000; // Tambah 2 jam
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft("Waktu Habis");
        return;
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}j ${minutes}m ${seconds}d`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-orange-500 uppercase tracking-tighter">
      <Clock size={10} />
      <span>Sisa: {timeLeft}</span>
    </div>
  );
};

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/my-history");
      const result = response.data.data || response.data;
      setHistory(Array.isArray(result) ? result : []);
    } catch (err: any) {
      console.error("Gagal mengambil history:", err);
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleItemClick = (item: any) => {
    const status = item.status?.toLowerCase();
    const isPending = status === 'pending';

    if (isPending) {
      const query = new URLSearchParams({
        order_id: item.order_id,
        price: (item.total_price / item.seat_count).toString(),
        seat_count: item.seat_count.toString(),
        customer_name: item.customer_name || "",
        customer_email: item.customer_email || "",
        customer_phone: item.customer_phone || "",
        schedule_id: item.schedule_id?.toString() || ""
      }).toString();
      
      router.push(`/pembayaran?${query}`);
    } else {
      router.push(`/tiket-saya/${item.order_id}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 font-poppins">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl text-blue-900 mb-8 font-black italic uppercase tracking-tighter">
          Riwayat <span className="text-blue-600">Transaksi</span>
        </h1>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : history.length > 0 ? (
            history.map((item: any) => {
              const status = item.status?.toLowerCase();
              const isPending = status === 'pending';

              return (
                <div 
                  key={item.order_id || item.id} 
                  onClick={() => handleItemClick(item)}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-500 transition cursor-pointer group overflow-hidden relative"
                >
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                      <h3 className="text-gray-800 font-bold tracking-tight">{item.order_id}</h3>
                    </div>
                    
                    <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        status === 'settlement' || status === 'success' || status === 'paid'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-600'
                        }`}>
                        {status}
                        </span>
                        
                        {/* Menampilkan Timer hanya jika status Pending */}
                        {isPending && <CountdownTimer createdAt={item.created_at} />}
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t border-gray-50 pt-4 relative z-10">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 text-left">Rute Perjalanan</p>
                      <div className="text-blue-900 text-sm font-bold flex items-center gap-2 italic">
                        {item.schedule?.origin || 'Unknown'} <ArrowRight size={12} className="text-blue-400" /> {item.schedule?.destination || 'Unknown'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Bayar</p>
                      <p className="text-blue-900 font-black italic">
                        IDR {Number(item.total_price || item.price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
               <Ticket className="mx-auto text-gray-200 mb-4" size={48} />
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Belum ada riwayat pesanan.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}