"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Ticket, ArrowRight, Loader2, Clock, Calendar, MapPin } from "lucide-react";

// Komponen Timer dengan format HH:MM:SS berwarna Merah
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
    <div className="mt-2 text-[14px] font-black text-red-600 tracking-tighter flex items-center justify-end gap-1">
       <Clock size={14} /> {timeLeft}
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

  // Format Tanggal Keberangkatan (Contoh: 24 Des 2025)
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleItemClick = (item: any, isExpired: boolean) => {
    if (isExpired) return;
    const status = item.status?.toLowerCase();
    if (status === 'pending') {
      const query = new URLSearchParams({
        order_id: item.order_id,
        price: (item.total_amount || item.total_price || item.price || 0).toString(),
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

        <div className="space-y-6">
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
                  className={`bg-white p-6 rounded-[2rem] border transition-all relative overflow-hidden ${
                    isHangus ? 'grayscale opacity-60 border-gray-200' : 'border-gray-100 shadow-xl shadow-gray-200/50 hover:border-blue-500 cursor-pointer group'
                  }`}
                >
                  {/* Bagian Atas: Order ID & Status */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Order ID</p>
                      <h3 className="text-gray-800 font-black tracking-tight italic uppercase">{item.order_id}</h3>
                    </div>
                    <div className="text-right">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${
                        isHangus ? 'bg-gray-200 text-gray-500' :
                        status === 'settlement' || status === 'success' || status === 'paid'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-600'
                        }`}>
                        {isHangus ? 'HANGUS' : status}
                        </span>
                        {isPending && <CountdownTimer createdAt={item.created_at} onExpire={() => fetchHistory()} />}
                    </div>
                  </div>

                  {/* Bagian Tengah: Jadwal Keberangkatan (BARU) */}
                  <div className="flex gap-6 mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-600" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Tanggal</span>
                            <span className="text-xs font-bold text-blue-900">{formatDate(item.schedule?.departure_date)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 border-l border-blue-200 pl-6">
                        <Clock size={14} className="text-blue-600" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Waktu</span>
                            <span className="text-xs font-bold text-blue-900 uppercase">{item.schedule?.departure_time || "--:--"} WIB</span>
                        </div>
                    </div>
                  </div>

                  {/* Bagian Bawah: Rute & Harga */}
                  <div className="flex justify-between items-end border-t border-gray-50 pt-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                        <MapPin size={10} /> Rute Perjalanan
                      </p>
                      <div className="text-blue-900 text-sm font-black flex items-center gap-3 italic uppercase">
                        {item.schedule?.origin} <ArrowRight size={14} className="text-orange-500 animate-pulse" /> {item.schedule?.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Total Bayar</p>
                      <p className={`text-xl font-black italic tracking-tighter ${isHangus ? 'text-gray-500' : 'text-blue-600'}`}>
                        IDR {Number(item.total_amount || item.total_price || item.price || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic font-black text-gray-200 uppercase tracking-[0.3em] text-xs">
               Kosong
            </div>
          )}
        </div>
      </div>
    </main>
  );
}