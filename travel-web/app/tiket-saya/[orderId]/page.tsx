"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient"; // Gunakan axiosClient
import { ArrowLeft, Calendar, Clock, User, Armchair, QrCode, Download, Share2, Loader2, MapPin } from "lucide-react";

export default function DetailTiket() {
  const { orderId } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiket = async () => {
      if (!orderId) return;
      try {
        const response = await axiosClient.get(`/bookings/${orderId}`);
        const data = response.data.data || response.data;
        setBooking(data);
      } catch (error: any) {
        console.error("Error fetching detail tiket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiket();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <Loader2 className="animate-spin text-orange-500" size={48} />
        <p className="font-bold text-gray-600 uppercase tracking-[0.3em] text-xs mt-6">Menyiapkan Tiket...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
        <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
          <p className="font-bold text-gray-800 text-lg mb-4">Tiket Tidak Ditemukan</p>
          <button 
            onClick={() => router.push('/history')} 
            className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all"
          >
            Kembali ke Riwayat
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
            onClick={() => router.back()} 
            className="p-3 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <div className="text-center">
            <h1 className="font-black italic text-gray-800 uppercase tracking-tight text-2xl">E-Tiket TripGo</h1>
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest">Express Transportation</p>
          </div>
          <div className="w-12"></div>
        </div>

        {/* Card Tiket */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="flex flex-col md:flex-row">
            {/* Orange Sidebar */}
            <div className="w-full md:w-48 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 p-8 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">TRIPGO</h2>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-100 mt-2">
                  {schedule?.class || "REGULER"}
                </p>
              </div>
              <div className="mt-8">
                <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase text-center border-2
                  ${currentStatus === 'success' || currentStatus === 'paid' || currentStatus === 'settlement' 
                  ? 'bg-emerald-500 border-emerald-400' 
                  : 'bg-amber-400 border-amber-300 text-amber-900'}`}>
                  {currentStatus}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-6">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] font-bold text-orange-500 uppercase">Asal</p>
                  <p className="text-3xl font-black text-gray-800 uppercase italic">{schedule?.origin}</p>
                </div>
                <div className="w-24 h-[2px] bg-orange-300 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-orange-500 rounded-full"></div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-[10px] font-bold text-orange-500 uppercase">Tujuan</p>
                  <p className="text-3xl font-black text-gray-800 uppercase italic">{schedule?.destination}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[9px] font-bold text-orange-500 uppercase mb-1">Keberangkatan</p>
                    <p className="font-bold text-gray-800 text-sm">{schedule?.departure_time?.substring(0, 5)} WIB</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-[9px] font-bold text-orange-500 uppercase mb-1">Kursi</p>
                    <p className="font-bold text-gray-800 text-sm">{booking.seat_count} Orang</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 col-span-2">
                    <p className="text-[9px] font-bold text-orange-500 uppercase mb-1">Nama Penumpang</p>
                    <p className="font-bold text-gray-800 text-sm">{booking.customer_name}</p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center border-2 border-dashed border-orange-200">
                  <QrCode size={80} className="text-gray-800 mb-2" />
                  <p className="text-[9px] font-black text-gray-700">{booking.order_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}