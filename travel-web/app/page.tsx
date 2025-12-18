"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // 1. State disesuaikan dengan kebutuhan parameter reservasi
  const [search, setSearch] = useState({
    origin: "",
    destination: "",
    date: "",
    seat_count: "1", // Diganti dari 'passengers' ke 'seat_count' agar sinkron
  });

  const cities = [
    "CILEGON", "SERANG", "TANGERANG", "JAKARTA", "BOGOR", 
    "BANDUNG", "CIREBON", "TEGAL", "PEKALONGAN", "SEMARANG", 
    "SALATIGA", "SOLO", "YOGYAKARTA", "MADIUN", "SURABAYA"
  ];

  const handleSearch = () => {
    // Validasi input
    if (!search.origin || !search.destination || !search.date) {
      alert("Silakan lengkapi lokasi asal, tujuan, dan tanggal keberangkatan!");
      return;
    }

    if (search.origin === search.destination) {
      alert("Lokasi asal dan tujuan tidak boleh sama!");
      return;
    }

    // Mengirim data ke halaman reservasi
    // Query string akan menjadi: ?origin=...&destination=...&date=...&seat_count=...
    const queryString = new URLSearchParams(search).toString();
    router.push(`/reservasi?${queryString}`);
  };

  return (
    <main className="pt-24 pb-20 font-poppins">
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-6">
        <h1 className="text-5xl font-bold text-blue-900 tracking-tight">TripGo</h1>
        <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed text-sm">
          Platform perjalanan modern untuk minibus antar kota. Nikmati pengalaman 
          pemesanan yang mudah, aman, dan nyaman dalam satu aplikasi.
        </p>

        {/* Gambar Hero */}
        <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
          <Image 
            src="/image/hero-bali.jpg" 
            alt="TripGo Travel" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* SEARCH BAR (Floating) */}
        <div className="relative -mt-20 z-10 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Lokasi Awal */}
            <div className="text-left md:border-r border-gray-100 pr-4">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
                <MapPin size={12} className="text-blue-500" /> Lokasi Awal
              </label>
              <select 
                value={search.origin}
                onChange={(e) => setSearch({ ...search, origin: e.target.value })}
                className="w-full font-semibold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="">PILIH ASAL</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Lokasi Tujuan */}
            <div className="text-left md:border-r border-gray-100 pr-4">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
                <MapPin size={12} className="text-red-500" /> Tujuan
              </label>
              <select 
                value={search.destination}
                onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                className="w-full font-semibold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="">PILIH TUJUAN</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Keberangkatan */}
            <div className="text-left md:border-r border-gray-100 pr-4">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
                <Calendar size={12} className="text-green-500" /> Tanggal
              </label>
              <input 
                type="date" 
                value={search.date}
                onChange={(e) => setSearch({ ...search, date: e.target.value })}
                className="w-full font-semibold text-gray-800 outline-none bg-transparent cursor-pointer" 
              />
            </div>

            {/* Penumpang */}
            <div className="text-left">
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">
                <Users size={12} className="text-orange-500" /> Penumpang
              </label>
              <select 
                value={search.seat_count}
                onChange={(e) => setSearch({ ...search, seat_count: e.target.value })}
                className="w-full font-semibold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Orang</option>
                ))}
              </select>
            </div>

            {/* Tombol Cari */}
            <div className="flex items-center">
              <button 
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Cari Tiket
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 mt-32 grid md:grid-cols-2 gap-20 items-center">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-widest uppercase">
            Travel Terpercaya
          </div>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight">Perjalanan Aman, <br/> Hati Tenang.</h2>
          <p className="text-gray-500 leading-relaxed text-justify">
            TripGo menghadirkan armada minibus terbaru dengan standar keamanan tinggi. 
            Setiap unit kami dilengkapi dengan AC, kursi yang dapat direbahkan, 
            dan pengemudi berpengalaman yang siap mengantar Anda sampai tujuan.
          </p>
          <div className="pt-4">
             <button className="border-b-2 border-blue-600 text-blue-600 font-bold text-sm pb-1">Selengkapnya tentang kami</button>
          </div>
        </div>
        
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image 
            src="/image/tripgo-bus.png" 
            alt="Armada TripGo" 
            fill 
            className="object-contain" 
          />
        </div>
      </section>
    </main>
  );
}