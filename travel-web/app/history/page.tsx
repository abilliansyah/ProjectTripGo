"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { Clock, Calendar, MapPin, ArrowRight, Loader2, AlertTriangle } from "lucide-react";

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
      console.error("Gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // FUNGSI FORMATTER (Updated untuk menangani format ISO "T")
  const formatTicketDate = (item: any) => {
    // 1. CARI DATA: Cek berbagai kemungkinan lokasi data
    let rawString = item.schedule?.departure_time || item.departure_time || item.date || "";

    // DEBUG: Jika kosong, return indikator khusus
    if (!rawString) return { d: "DATA KOSONG", t: "NULL" };

    try {
      // 2. BERSIHKAN FORMAT: Ubah "2025-12-18T08:00:00.000Z" menjadi "2025-12-18 08:00:00"
      // Langkah ini penting jika API otomatis mengubah format ke ISO
      let cleanString = rawString.toString().replace("T", " ").replace("Z", "");
      
      // Hapus milisecond (jika ada titik)
      cleanString = cleanString.split(".")[0]; 

      // 3. SPLIT MANUAL
      const parts = cleanString.trim().split(" ");
      const datePart = parts[0]; // 2025-12-18
      const timePart = parts[1]; // 08:00:00

      // 4. FORMAT TANGGAL
      const ymd = datePart.split("-");
      let formattedDate = datePart;
      
      if (ymd.length === 3) {
        const months = ["JAN", "FEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOV", "DES"];
        const mIdx = parseInt(ymd[1]) - 1;
        // Pastikan index bulan valid
        if (months[mIdx]) {
           formattedDate = `${ymd[2]} ${months[mIdx]} ${ymd[0]}`;
        }
      }

      // 5. FORMAT WAKTU
      const formattedTime = timePart ? timePart.substring(0, 5) : "00:00";

      return { d: formattedDate, t: formattedTime };
    } catch (e) {
      return { d: "ERROR PARSE", t: "ERR" };
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 font-poppins">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl text-blue-900 mb-8 font-black italic uppercase tracking-tighter">
          Riwayat <span className="text-blue-600">Debug Mode</span>
        </h1>

        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : history.length > 0 ? (
            history.map((item: any, index) => {
              const dateTime = formatTicketDate(item);
              const rawDataCheck = item.schedule?.departure_time || "TIDAK DITEMUKAN";

              return (
                <div key={index} className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xl mb-6">
                  
                  {/* --- AREA DEBUGGING (MERAH) --- */}
                  <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200 text-xs font-mono text-red-700 break-all">
                    <p className="font-bold flex items-center gap-2"><AlertTriangle size={14}/> INFO RAW DATA (Screenshot Ini):</p>
                    <p>1. Lokasi Data (schedule.departure_time): <strong>{JSON.stringify(item.schedule?.departure_time)}</strong></p>
                    <p>2. Lokasi Alternatif (item.departure_time): <strong>{JSON.stringify(item.departure_time)}</strong></p>
                    <p>3. Object Schedule Utuh: {JSON.stringify(item.schedule)}</p>
                  </div>
                  {/* --- END DEBUGGING --- */}

                  <div className="flex gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <div className="flex-1">
                        <span className="text-[10px] font-black text-blue-400 uppercase">Tanggal</span>
                        <p className="text-lg font-black text-blue-900">{dateTime.d}</p>
                    </div>
                    <div className="flex-1 border-l border-blue-200 pl-4">
                        <span className="text-[10px] font-black text-blue-400 uppercase">Waktu</span>
                        <p className="text-lg font-black text-blue-900">{dateTime.t} WIB</p>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-black italic uppercase text-gray-800">{item.order_id}</h3>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold">DATA KOSONG</div>
          )}
        </div>
      </div>
    </main>
  );
}