"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { MapPin, Calendar, Users, Loader2, Search, Clock, BadgeCheck, ChevronRight } from "lucide-react";

function ReservasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil parameter dari URL (Sinkron dengan HomePage)
  const urlOrigin = searchParams.get("origin") || "";
  const urlDestination = searchParams.get("destination") || "";
  const urlDate = searchParams.get("date") || "";
  const urlSeatCount = searchParams.get("seat_count") || "1";

  // State Form
  const [form, setForm] = useState({
    origin: urlOrigin,
    destination: urlDestination,
    date: urlDate,
    seat_count: urlSeatCount,
  });

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const cities = [
    "CILEGON", "SERANG", "TANGERANG", "JAKARTA", "BOGOR", 
    "BANDUNG", "CIREBON", "TEGAL", "PEKALONGAN", "SEMARANG", 
    "SALATIGA", "SOLO", "YOGYAKARTA", "MADIUN", "SURABAYA"
  ];

  const getSchedules = async (origin: string, destination: string) => {
    if (!origin || !destination) return;
    setLoading(true);
    setHasSearched(true);
    try {
      // Endpoint ini akan menembak ke Railway via axiosClient
      const response = await axiosClient.get("/api/schedules", {
        params: { origin, destination }
      });
      setSchedules(response.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlOrigin && urlDestination) {
      setForm({
        origin: urlOrigin,
        destination: urlDestination,
        date: urlDate,
        seat_count: urlSeatCount,
      });
      getSchedules(urlOrigin, urlDestination);
    }
  }, [urlOrigin, urlDestination, urlDate, urlSeatCount]);

  const handleInternalSearch = () => {
    if (!form.origin || !form.destination || !form.date) {
      alert("Silakan lengkapi data pencarian!");
      return;
    }
    if (form.origin === form.destination) {
      alert("Lokasi asal dan tujuan tidak boleh sama!");
      return;
    }
    const queryString = new URLSearchParams(form).toString();
    router.push(`/reservasi?${queryString}`);
  };

  const handleSelection = (item: any) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Silakan login terlebih dahulu untuk melanjutkan pemesanan.");
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const cleanTime = item.departure_time && !item.departure_time.includes('-') 
      ? item.departure_time.substring(0, 5) 
      : "00:00";

    const query = new URLSearchParams({
      schedule_id: item.id.toString(),
      origin: item.origin,
      destination: item.destination,
      price: item.price.toString(),
      class: item.class,
      time: cleanTime,
      date: urlDate,
      seat_count: urlSeatCount,
    }).toString();

    router.push(`/konfirmasi?${query}`);
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-4 font-poppins">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* --- SEARCH BAR SECTION (Premium Look) --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <MapPin size={14} /> Asal
              </label>
              <select 
                value={form.origin}
                onChange={(e) => setForm({...form, origin: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-blue-200 focus:bg-white transition-all text-sm"
              >
                <option value="">Pilih Kota</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <MapPin size={14} /> Tujuan
              </label>
              <select 
                value={form.destination}
                onChange={(e) => setForm({...form, destination: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-blue-200 focus:bg-white transition-all text-sm"
              >
                <option value="">Pilih Kota</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Calendar size={14} /> Tanggal
              </label>
              <input 
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-blue-200 focus:bg-white transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                <Users size={14} /> Penumpang
              </label>
              <select 
                value={form.seat_count}
                onChange={(e) => setForm({...form, seat_count: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-blue-200 focus:bg-white transition-all text-sm"
              >
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
                <option value="3">3 Orang</option>
              </select>
            </div>

            <button 
              onClick={handleInternalSearch}
              className="bg-blue-900 hover:bg-blue-800 text-white font-black h-[56px] rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 text-xs uppercase tracking-widest italic"
            >
              <Search size={20} strokeWidth={3} /> Update Cari
            </button>
          </div>
        </div>

        {/* --- HASIL JADWAL --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Pilih <span className="text-blue-600">Keberangkatan</span></h3>
              {schedules.length > 0 && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest border border-blue-100">{schedules.length} Tersedia</span>}
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-blue-600 mb-6" size={56} />
              <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Mencari Armada Terbaik...</p>
            </div>
          ) : schedules.length > 0 ? (
            schedules.map((item: any) => {
              const seatsAvailable = item.remaining_seats ?? item.available_seats ?? 0;
              const requestedPassengers = parseInt(urlSeatCount) || 1;
              const isSeatsNotEnough = requestedPassengers > seatsAvailable;

              const displayTime = item.departure_time && !item.departure_time.includes('-') 
                ? `${item.departure_time.substring(0, 5)}` 
                : "00:00";

              return (
                <div key={item.id} className="group bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className="flex flex-wrap justify-between items-center border-b border-dashed border-gray-100 pb-8 mb-8 gap-8">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-blue-50 rounded-[1.5rem] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                        <Clock size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Berangkat</p>
                        <div className="flex items-end gap-2">
                          <p className="text-3xl font-black text-gray-900 tracking-tighter">{displayTime}</p>
                          <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase">Wib</p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden lg:block text-center px-10 border-x border-gray-50">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Durasi</p>
                      <p className="font-black text-gray-800 text-lg tracking-tight">{item.duration ?? '-'} <span className="text-xs font-bold">JAM</span></p>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Tipe Armada</p>
                      <div className="flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-wider bg-blue-50/50 px-3 py-1 rounded-lg">
                        <BadgeCheck size={16} /> {item.class}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Kapasitas</p>
                      <p className={`font-black text-lg ${isSeatsNotEnough || seatsAvailable === 0 ? 'text-red-500' : 'text-gray-900'}`}>
                        {seatsAvailable === 0 ? 'FULL' : `${seatsAvailable}`} <span className="text-[10px] font-bold text-gray-400 uppercase">Kursi</span>
                      </p>
                    </div>

                    <div className="text-right bg-gray-50/50 p-4 rounded-2xl min-w-[150px]">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Harga Tiket</p>
                      <p className="text-2xl font-black text-blue-900 tracking-tighter">{formatIDR(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex-1 w-full">
                      <div className="relative flex justify-between items-center w-full px-4 group/path">
                        <div className="absolute h-[2px] bg-gray-100 w-[94%] top-[8px] left-[3%] z-0"></div>
                        {item.stops && (() => {
                          try {
                            const stopsArray = typeof item.stops === 'string' ? JSON.parse(item.stops) : item.stops;
                            return stopsArray.map((stop: string, idx: number) => (
                              <div key={idx} className="relative z-10 flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full bg-white border-[4px] shadow-sm transition-transform group-hover/path:scale-125 ${idx === 0 || idx === stopsArray.length - 1 ? 'border-blue-600' : 'border-gray-300'}`}></div>
                                <span className="text-[9px] font-black text-gray-400 mt-3 bg-white px-2 uppercase tracking-widest">{stop}</span>
                              </div>
                            ));
                          } catch (e) {
                            return <div className="text-[10px] font-black text-blue-600 tracking-widest italic">EKSPRES LANGSUNG</div>;
                          }
                        })()}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSelection(item)}
                      disabled={seatsAvailable === 0 || isSeatsNotEnough}
                      className={`w-full md:w-auto px-12 py-5 rounded-[1.5rem] font-black transition-all shadow-xl group/btn flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] italic
                        ${(seatsAvailable === 0 || isSeatsNotEnough)
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none" 
                          : "bg-blue-900 hover:bg-orange-500 text-white shadow-blue-100 hover:shadow-orange-100 active:scale-95"
                        }`}
                    >
                      {seatsAvailable === 0 
                        ? "Tiket Habis" 
                        : isSeatsNotEnough 
                          ? "Kursi Terbatas" 
                          : <>Pesan Tiket <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" /></>}
                    </button>
                  </div>
                </div>
              );
            })
          ) : hasSearched ? (
            <div className="bg-white py-32 text-center rounded-[3rem] border border-dashed border-gray-200">
               <Search className="mx-auto text-gray-100 mb-6" size={80} strokeWidth={1} />
               <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">Rute <span className="text-orange-500">Tidak Ditemukan</span></h4>
               <p className="text-gray-400 mt-3 font-medium max-w-sm mx-auto text-sm">Maaf, perjalanan dari {form.origin} ke {form.destination} belum tersedia untuk tanggal yang dipilih.</p>
            </div>
          ) : (
            <div className="bg-white py-32 text-center rounded-[3rem] border border-dashed border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
               <div className="relative inline-block mb-6">
                 <div className="absolute -inset-4 bg-blue-50 rounded-full blur-xl animate-pulse" />
                 <MapPin className="relative text-blue-600 mx-auto" size={80} strokeWidth={1} />
               </div>
               <h4 className="text-2xl font-black text-gray-900 tracking-tighter italic">Cek <span className="text-blue-600">Jadwal Minibus</span></h4>
               <p className="text-gray-400 mt-3 font-medium text-sm">Gunakan panel pencarian di atas untuk melihat ketersediaan rute dan harga terbaru.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ReservasiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-900" size={40} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Memuat Layanan...</p>
        </div>
      </div>
    }>
      <ReservasiContent />
    </Suspense>
  );
}