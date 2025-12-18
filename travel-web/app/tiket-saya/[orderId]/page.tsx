"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, Armchair, QrCode, Download, Share2, Loader2, MapPin } from "lucide-react";

export default function DetailTiket() {
  const params = useParams();
  const orderId = params?.orderId;
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiket = async () => {
      try {
        // Gunakan URL langsung jika ENV tidak terbaca di Vercel
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://projecttripgo-production-1bec.up.railway.app/api';
        
        const res = await fetch(`${baseUrl}/bookings/${orderId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          // Pastikan cache tidak menyimpan data lama
          cache: 'no-store'
        });

        if (!res.ok) {
          console.error(`Fetch error: ${res.status}`);
          throw new Error("Gagal mengambil data tiket");
        }

        const result = await res.json();
        
        // Menangani jika Laravel menggunakan API Resource (data biasanya di dalam properti .data)
        const finalData = result.data ? result.data : result;
        setBooking(finalData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchTiket();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Loader2 className="animate-spin text-orange-500 relative z-10" size={48} strokeWidth={2.5} />
        </div>
        <p className="font-bold text-gray-600 animate-pulse uppercase tracking-[0.3em] text-xs mt-6">Menyiapkan Tiket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <p className="font-bold text-gray-800 text-lg mb-4">Tiket Tidak Ditemukan</p>
          <p className="text-gray-500 text-sm mb-6">ID Pesanan: {orderId}</p>
          <button 
            onClick={() => router.push('/')} 
            className="mt-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all active:scale-95"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  const schedule = booking.schedule;
  const currentStatus = booking.status || "pending";

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8 px-4 font-poppins">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push("/")} 
            className="p-3 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 border border-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="text-center">
            <h1 className="font-black italic text-gray-800 uppercase tracking-tight text-2xl">E-Tiket TripGo</h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Express Transportation</p>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative transform hover:scale-[1.01] transition-transform duration-300">
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Orange Sidebar */}
            <div className="w-full md:w-48 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 p-8 text-white relative overflow-hidden flex flex-col">
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="bg-white p-2 rounded-2xl inline-block mb-4 shadow-inner">
                    <img 
                      src="/image/logo.png" 
                      alt="TripGo Logo" 
                      className="w-10 h-10 object-contain"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/40"; }} 
                    />
                  </div>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-1">TRIPGO</h2>
                  <p className="text-sm font-bold opacity-90 tracking-wide mb-2">EXPRESS</p>
                  <p className="text-[9px] font-bold uppercase opacity-80 tracking-[0.25em] text-orange-100">
                    {schedule?.class || "REGULER"}
                  </p>
                </div>

                <div className="mt-8">
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black shadow-lg border-2 uppercase backdrop-blur-sm text-center
                    ${currentStatus.toLowerCase() === 'success' || currentStatus.toLowerCase() === 'paid' 
                      ? 'bg-emerald-500 text-white border-emerald-400' 
                      : 'bg-amber-400 text-amber-900 border-amber-300'}`}>
                    {currentStatus.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Main Content */}
            <div className="flex-1 p-8">
              <div className="h-full flex flex-col justify-between">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-orange-50 via-white to-orange-50 rounded-2xl p-6 border-2 border-orange-100">
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                        <div className="bg-orange-500 p-2 rounded-xl">
                          <MapPin size={16} className="text-white" />
                        </div>
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Keberangkatan</p>
                      </div>
                      <p className="text-3xl font-black text-gray-800 uppercase italic tracking-tight">{schedule?.origin || "-"}</p>
                    </div>
                    
                    <div className="flex flex-col items-center px-4 relative">
                      <div className="w-24 sm:w-32 relative flex items-center">
                        <div className="flex-1 h-[3px] bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 bg-white border-4 border-orange-500 w-5 h-5 rounded-full shadow-md"></div>
                      </div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-3 tracking-wider">Perjalanan</p>
                    </div>
                    
                    <div className="text-center sm:text-right">
                      <div className="flex items-center justify-center sm:justify-end gap-2 mb-2">
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Tujuan</p>
                        <div className="bg-orange-500 p-2 rounded-xl">
                          <MapPin size={16} className="text-white" />
                        </div>
                      </div>
                      <p className="text-3xl font-black text-gray-800 uppercase italic tracking-tight">{schedule?.destination || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Calendar size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-wide">Tanggal</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">
                        {booking.created_at ? new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Clock size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-wide">Waktu</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">{schedule?.departure_time?.substring(0, 5) || "00:00"} WIB</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <User size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-wide">Nama</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm truncate">{booking.customer_name || "Pelanggan"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-center gap-2 text-orange-500 mb-2">
                        <Armchair size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-wide">Kursi</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm">{booking.seat_count || 1} Kursi</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center border-2 border-dashed border-orange-200 shadow-inner">
                    <div className="bg-white p-3 rounded-xl shadow-md border border-orange-100 mb-2">
                      <QrCode size={80} className="text-gray-800" />
                    </div>
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{booking.order_id || orderId}</p>
                  </div>
                </div>

                <div className="mt-6 text-center border-t border-gray-100 pt-4">
                  <p className="text-[9px] text-gray-400 font-medium">
                    Tunjukkan QR code ini saat boarding • Terima kasih telah memilih TripGo!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-lg mx-auto">
          <button className="flex-1 flex items-center justify-center gap-3 bg-white text-gray-700 font-bold py-4 rounded-2xl border-2 border-gray-200 active:scale-95 transition-all shadow-lg hover:border-orange-300 hover:text-orange-600">
            <Download size={18} /> 
            <span className="uppercase tracking-wide text-xs">Simpan PDF</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-lg hover:bg-orange-600">
            <Share2 size={18} /> 
            <span className="uppercase tracking-wide text-xs">Bagikan</span>
          </button>
        </div>
      </div>
    </main>
  );
}