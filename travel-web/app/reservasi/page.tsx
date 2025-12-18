"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosClient from "@/utils/axiosClient";
import { MapPin, Calendar, Users, Loader2, Search, Clock, BadgeCheck } from "lucide-react";

function ReservasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil parameter dari URL
  const urlOrigin = searchParams.get("origin") || "";
  const urlDestination = searchParams.get("destination") || "";
  const urlDate = searchParams.get("date") || "";
  const urlPassengers = searchParams.get("passengers") || "1";

  // State Form untuk Search Bar
  const [form, setForm] = useState({
    origin: urlOrigin,
    destination: urlDestination,
    date: urlDate,
    passengers: urlPassengers,
  });

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const cities = [
    "CILEGON", "SERANG", "TANGERANG", "JAKARTA", "BOGOR", 
    "BANDUNG", "CIREBON", "TEGAL", "PEKALONGAN", "SEMARANG", 
    "SALATIGA", "SOLO", "YOGYAKARTA", "MADIUN", "SURABAYA"
  ];

  // Fetch Data
  const getSchedules = async (origin: string, destination: string) => {
    if (!origin || !destination) return;
    setLoading(true);
    setHasSearched(true);
    try {
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
        passengers: urlPassengers,
      });
      getSchedules(urlOrigin, urlDestination);
    }
  }, [urlOrigin, urlDestination, urlDate, urlPassengers]);

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

    // PERBAIKAN BUG: Membersihkan format waktu agar tidak membawa data tanggal
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
      seat_count: urlPassengers,
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
    <main className="min-h-screen bg-[#F8F9FA] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* --- SEARCH BAR SECTION --- */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1">
                <MapPin size={12} /> Dari
              </label>
              <select 
                value={form.origin}
                onChange={(e) => setForm({...form, origin: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-3 rounded-xl border border-transparent focus:border-blue-200 transition"
              >
                <option value="">Pilih Kota</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1">
                <MapPin size={12} /> Ke
              </label>
              <select 
                value={form.destination}
                onChange={(e) => setForm({...form, destination: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-3 rounded-xl border border-transparent focus:border-blue-200 transition"
              >
                <option value="">Pilih Kota</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1">
                <Calendar size={12} /> Tanggal
              </label>
              <input 
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-3 rounded-xl border border-transparent focus:border-blue-200 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 ml-1">
                <Users size={12} /> Kursi
              </label>
              <select 
                value={form.passengers}
                onChange={(e) => setForm({...form, passengers: e.target.value})}
                className="w-full font-bold text-gray-800 outline-none bg-gray-50 p-3 rounded-xl border border-transparent focus:border-blue-200 transition"
              >
                <option value="1">1 Penumpang</option>
                <option value="2">2 Penumpang</option>
                <option value="3">3 Penumpang</option>
              </select>
            </div>

            <button 
              onClick={handleInternalSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-[48px] rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <Search size={18} /> Cari
            </button>
          </div>
        </div>

        {/* --- HASIL JADWAL --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-bold text-gray-800">Jadwal Tersedia</h3>
             {schedules.length > 0 && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{schedules.length} Pilihan</span>}
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-500 font-bold">Mencari rute terbaik...</p>
            </div>
          ) : schedules.length > 0 ? (
            schedules.map((item: any) => {
              const seatsAvailable = item.remaining_seats ?? item.available_seats ?? 0;
              const requestedPassengers = parseInt(urlPassengers) || 1;
              const isSeatsNotEnough = requestedPassengers > seatsAvailable;

              // Logika perbaikan tampilan waktu keberangkatan
              const displayTime = item.departure_time && !item.departure_time.includes('-') 
                ? `${item.departure_time.substring(0, 5)} WIB` 
                : "00:00 WIB";

              return (
                <div key={item.id} className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-wrap justify-between items-center border-b border-dashed border-gray-200 pb-6 mb-6 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Berangkat</p>
                        <p className="text-xl font-black text-gray-800">{displayTime}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Durasi</p>
                      <p className="font-bold text-gray-700">{item.duration ?? '-'} JAM</p>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Kelas</p>
                      <div className="flex items-center gap-1 text-blue-600 font-black text-sm uppercase">
                        <BadgeCheck size={14} /> {item.class}
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sisa Kursi</p>
                      <p className={`font-bold ${isSeatsNotEnough || seatsAvailable === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                        {seatsAvailable === 0 ? 'HABIS' : `${seatsAvailable} Kursi`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Harga</p>
                      <p className="text-2xl font-black text-blue-900">{formatIDR(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex-1 w-full max-w-lg">
                      <p className="text-[10px] font-bold text-gray-400 mb-5 uppercase tracking-wider">Detail Perjalanan</p>
                      <div className="relative flex justify-between items-center w-full px-2">
                        <div className="absolute h-[2px] bg-gray-100 w-[94%] top-[7px] left-[3%] z-0"></div>
                        {item.stops && (() => {
                          try {
                            const stopsArray = typeof item.stops === 'string' ? JSON.parse(item.stops) : item.stops;
                            return stopsArray.map((stop: string, idx: number) => (
                              <div key={idx} className="relative z-10 flex flex-col items-center">
                                <div className={`w-3.5 h-3.5 rounded-full bg-white border-[3px] shadow-sm ${idx === 0 || idx === stopsArray.length - 1 ? 'border-blue-600' : 'border-gray-300'}`}></div>
                                <span className="text-[10px] font-bold text-gray-500 mt-2 bg-white px-1 uppercase">{stop}</span>
                              </div>
                            ));
                          } catch (e) {
                            return <div className="text-[10px] font-bold text-blue-600">RUTE LANGSUNG</div>;
                          }
                        })()}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleSelection(item)}
                      disabled={seatsAvailable === 0 || isSeatsNotEnough}
                      className={`w-full md:w-auto px-16 py-4 rounded-2xl font-black transition-all shadow-lg 
                        ${(seatsAvailable === 0 || isSeatsNotEnough)
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                          : "bg-orange-400 hover:bg-orange-500 text-white shadow-orange-100 active:scale-95"
                        }`}
                    >
                      {seatsAvailable === 0 
                        ? "Penuh" 
                        : isSeatsNotEnough 
                          ? "Kursi Kurang" 
                          : "Pilih Kursi"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : hasSearched ? (
            <div className="bg-white p-20 text-center rounded-[2.5rem] border border-dashed border-gray-300">
               <Search className="mx-auto text-gray-200 mb-4" size={64} />
               <h4 className="text-xl font-bold text-gray-800">Jadwal Tidak Ditemukan</h4>
               <p className="text-gray-400 mt-2">Maaf, rute {form.origin} ke {form.destination} belum tersedia pada tanggal ini.</p>
            </div>
          ) : (
            <div className="bg-white p-20 text-center rounded-[2.5rem] border border-dashed border-gray-300 shadow-sm">
               <MapPin className="mx-auto text-blue-100 mb-4" size={64} />
               <h4 className="text-xl font-bold text-gray-800">Siap Untuk Berangkat?</h4>
               <p className="text-gray-400 mt-2">Gunakan pencarian di atas untuk melihat jadwal minibus kami.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ReservasiPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-gray-400 font-bold">Memuat Halaman...</div>}>
      <ReservasiContent />
    </Suspense>
  );
}