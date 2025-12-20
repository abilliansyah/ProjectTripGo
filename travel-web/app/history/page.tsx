"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Ticket, ArrowRight, Loader2, Clock } from "lucide-react";

// Komponen Timer yang diperbarui
const CountdownTimer = ({ createdAt, onExpire }: { createdAt: string; onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const startTime = new Date(createdAt).getTime();
      const expiryTime = startTime + 2 * 60 * 60 * 1000; 
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        if (!isExpired) {
          setIsExpired(true);
          onExpire();
        }
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
      const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
      const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [createdAt, isExpired, onExpire]);

  return (
    <div className="flex items-center justify-end gap-1 mt-2 text-xs font-black text-red-600 tracking-wider">
      <Clock size={12} />
      <span>{timeLeft}</span>
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleItemClick = (item: any, isExpired: boolean) => {
    if (isExpired) return; // Jangan bisa diklik jika sudah hangus

    const status = item.status?.toLowerCase();
    if (status === 'pending') {
      const query = new URLSearchParams({
        order_id: item.order_id,
        price: (item.total_amount || item.total_price || 0).toString(), // Pastikan harga terkirim
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
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : history.length > 0 ? (
            history.map((item: any) => {
              const status = item.status?.toLowerCase();
              const startTime = new Date(item.created_at).getTime();
              const isTimeOut = (new Date().getTime() - startTime) > (2 * 60 * 60 * 1000);
              const isPending = status === 'pending' && !isTimeOut;
              const isHangus = status === 'pending' && isTimeOut;

              return (
                <div 
                  key={item.order_id || item.id} 
                  onClick={() => handleItemClick(item, isHangus)}
                  className={`bg-white p-6 rounded-2xl border transition-all relative overflow-hidden ${
                    isHangus ? 'grayscale opacity-60 border-gray-200 cursor-not-allowed' : 'border-gray-100 shadow-sm hover:border-blue-500 cursor-pointer group'
                  }`}
                >
                  <div className="flex justify-between items-start mb-5 relative z-10">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                      <h3 className="text-gray-800 font-bold tracking-tight">{item.order_id}</h3>
                    </div>
                    
                    <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        isHangus ? 'bg-gray-200 text-gray-500' :
                        status === 'settlement' || status === 'success' || status === 'paid'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-600'
                        }`}>
                        {isHangus ? 'HANGUS' : status}
                        </span>
                        
                        {isPending && (
                          <CountdownTimer 
                            createdAt={item.created_at} 
                            onExpire={() => fetchHistory()} // Refresh data saat waktu habis
                          />
                        )}
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
                      <p className={`font-black italic ${isHangus ? 'text-gray-500' : 'text-blue-900'}`}>
                        IDR {Number(item.total_amount || item.total_price || item.price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 italic font-black text-gray-300 uppercase tracking-widest text-xs">
               Belum ada riwayat pesanan.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}