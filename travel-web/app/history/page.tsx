"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Clock, Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";

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

    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [createdAt, isExpired, onExpire]);

  return (
    <div className="text-[14px] font-black text-red-600 tracking-tighter flex items-center justify-center gap-1 mt-1">
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

  // --- FUNGSI FIX (DISESUAIKAN DENGAN JSON ANDA) ---
  const formatTicketData = (item: any) => {
    try {
      // 1. AMBIL WAKTU: Dari schedule.departure_time ("20:00")
      // Jika kosong, gunakan default
      let timeString = item.schedule?.departure_time || "--:--";
      // Pastikan formatnya bersih (ambil 5 karakter pertama: HH:mm)
      timeString = timeString.substring(0, 5);

      // 2. AMBIL TANGGAL: Dari item.created_at atau item.date
      // Karena schedule tidak punya tanggal, kita pakai tanggal transaksi/order
      const rawDate = item.date || item.created_at || new Date().toISOString();
      
      const dateObj = new Date(rawDate);
      const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
      
      const day = dateObj.getDate();
      const month = months[dateObj.getMonth()];
      const year = dateObj.getFullYear();

      const dateString = `${day} ${month} ${year}`;

      return { d: dateString, t: timeString };
    } catch (e) {
      return { d: "-", t: "--:--" };
    }
  };

  const handleItemClick = (item: any, isExpired: boolean) => {
    if (isExpired) return;
    const status = item.status?.toLowerCase();
    if (status === 'pending') {
      const query = new URLSearchParams({
        order_id: item.order_id,
        price: (item.total_amount || 0).toString(),
        seat_count: item.seat_count?.toString() || "1",
        customer_name: item.customer_name || "",
        customer_email: item.customer_email || "",
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

        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : history.length > 0 ? (
            history.map((item: any) => {
              const status = item.status?.toLowerCase();
              const startTime = new Date(item.created_at).getTime();
              const isTimeOut = (new Date().getTime() - startTime) > (2 * 60 * 60 * 1000);
              const isSuccess = ['settlement', 'success', 'paid', 'capture'].includes(status);
              const isPending = status === 'pending' && !isTimeOut;
              const isHangus = (status === 'pending' && isTimeOut) || ['expire', 'cancel', 'deny'].includes(status);

              // Panggil fungsi format baru
              const { d, t } = formatTicketData(item);

              return (
                <div 
                  key={item.order_id} 
                  onClick={() => handleItemClick(item, isHangus)}
                  className={`bg-white p-8 rounded-[2.5rem] border transition-all relative overflow-hidden shadow-2xl ${
                    isHangus ? 'grayscale opacity-60 border-gray-200 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Order ID</p>
                      <h3 className="font-black italic uppercase text-xl text-blue-900">{item.order_id}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className={`px-6 py-2 rounded-2xl text-[11px] font-black border ${
                           isHangus ? 'bg-gray-100 text-gray-400' : isSuccess ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                           {isHangus ? 'HANGUS' : (isSuccess ? 'SUCCESS' : 'PENDING')}
                        </span>
                        {isPending && <CountdownTimer createdAt={item.created_at} onExpire={() => fetchHistory()} />}
                    </div>
                  </div>

                  <div className="flex gap-6 mb-8 p-6 rounded-3xl border bg-blue-50/50 border-blue-100">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                           <Calendar size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black text-blue-400 uppercase">Tanggal</span>
                            <span className="text-sm font-black text-blue-900">{d}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border-l border-gray-200 pl-6 flex-1">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                           <Clock size={18} />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black text-blue-400 uppercase">Waktu</span>
                            <span className="text-sm font-black text-blue-900">{t} WIB</span>
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end border-t pt-8 border-gray-100">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-3 flex items-center gap-2"><MapPin size={12} /> Rute</p>
                      <div className="text-lg font-black italic uppercase text-blue-900 flex items-center gap-2">
                        {item.schedule?.origin} <ArrowRight size={18} /> {item.schedule?.destination}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Total</p>
                      <p className="text-2xl font-black italic text-blue-600">IDR {Number(item.total_amount || 0).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-40 font-black text-gray-300 uppercase">KOSONG</div>
          )}
        </div>
      </div>
    </main>
  );
}