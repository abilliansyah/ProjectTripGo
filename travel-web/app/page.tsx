"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MapPin, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  
  // Logic untuk Image Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = ["/image/1.png", "/image/2.png", "/image/3.png", "/image/4.png", "/image/5.png"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Ganti gambar setiap 5 detik
    return () => clearInterval(timer);
  }, []);

  const [search, setSearch] = useState({
    origin: "",
    destination: "",
    date: "",
    seat_count: "1",
  });

  const cities = [
    "CILEGON", "SERANG", "TANGERANG", "JAKARTA", "BOGOR", 
    "BANDUNG", "CIREBON", "TEGAL", "PEKALONGAN", "SEMARANG", 
    "SALATIGA", "SOLO", "YOGYAKARTA", "MADIUN", "SURABAYA"
  ];

  const handleSearch = () => {
    if (!search.origin || !search.destination || !search.date) {
      alert("Silakan lengkapi lokasi asal, tujuan, dan tanggal keberangkatan!");
      return;
    }
    if (search.origin === search.destination) {
      alert("Lokasi asal dan tujuan tidak boleh sama!");
      return;
    }
    const queryString = new URLSearchParams(search).toString();
    router.push(`/reservasi?${queryString}`);
  };

  return (
    <main className="pt-24 pb-20 font-poppins bg-[#FBFBFB]">
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-6xl font-black text-blue-900 tracking-tighter italic">
            Trip<span className="text-orange-500">Go</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 leading-relaxed text-sm font-medium">
            Jelajahi Pulau Jawa dengan armada minibus eksekutif. 
            Kursi nyaman, tepat waktu, dan pemesanan instan dalam genggaman.
          </p>
        </div>

        {/* --- IMAGE SLIDER DENGAN ANIMASI --- */}
        <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl group border-[12px] border-white">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            >
              <Image 
                src={img} 
                alt={`Pemandangan ${index + 1}`} 
                fill 
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay Gradient agar teks search bar lebih terbaca nantinya */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </div>
          ))}

          {/* Indikator Slider (Dots) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImages.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
                }`} 
              />
            ))}
          </div>
        </div>

        {/* --- SEARCH BAR (FLOATING & POLED) --- */}
        <div className="relative -mt-24 z-30 max-w-6xl mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 md:p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Lokasi Awal */}
              <div className="text-left px-4 border-r-0 md:border-r border-gray-100 group">
                <label className="flex items-center gap-2 text-[10px] font-black text-blue-600 mb-2 tracking-[0.2em] uppercase">
                  <MapPin size={14} /> Lokasi Asal
                </label>
                <select 
                  value={search.origin}
                  onChange={(e) => setSearch({ ...search, origin: e.target.value })}
                  className="w-full font-bold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none text-sm"
                >
                  <option value="">PILIH ASAL</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Lokasi Tujuan */}
              <div className="text-left px-4 border-r-0 md:border-r border-gray-100">
                <label className="flex items-center gap-2 text-[10px] font-black text-orange-500 mb-2 tracking-[0.2em] uppercase">
                  <MapPin size={14} /> Destinasi
                </label>
                <select 
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                  className="w-full font-bold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none text-sm"
                >
                  <option value="">PILIH TUJUAN</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Keberangkatan */}
              <div className="text-left px-4 border-r-0 md:border-r border-gray-100">
                <label className="flex items-center gap-2 text-[10px] font-black text-green-600 mb-2 tracking-[0.2em] uppercase">
                  <Calendar size={14} /> Keberangkatan
                </label>
                <input 
                  type="date" 
                  value={search.date}
                  onChange={(e) => setSearch({ ...search, date: e.target.value })}
                  className="w-full font-bold text-gray-800 outline-none bg-transparent cursor-pointer text-sm" 
                />
              </div>

              {/* Penumpang */}
              <div className="text-left px-4">
                <label className="flex items-center gap-2 text-[10px] font-black text-purple-600 mb-2 tracking-[0.2em] uppercase">
                  <Users size={14} /> Kursi
                </label>
                <select 
                  value={search.seat_count}
                  onChange={(e) => setSearch({ ...search, seat_count: e.target.value })}
                  className="w-full font-bold text-gray-800 outline-none bg-transparent cursor-pointer appearance-none text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Penumpang</option>
                  ))}
                </select>
              </div>

              {/* Tombol Cari */}
              <div className="flex items-center p-2">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-blue-900 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-100 hover:shadow-orange-200 active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-widest italic"
                >
                  <Search size={18} strokeWidth={3} />
                  Cari Jadwal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 mt-40 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-blue-100/50 rounded-[3rem] blur-2xl group-hover:bg-orange-100/50 transition-colors duration-700" />
          <div className="relative w-full h-[350px] md:h-[450px]">
            <Image 
              src="/image/tripgo-bus.png" 
              alt="Armada TripGo" 
              fill 
              className="object-contain drop-shadow-2xl scale-110" 
            />
          </div>
        </div>

        <div className="space-y-8 pl-0 md:pl-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
            Tentang TripGo Express
          </div>
          <h2 className="text-5xl font-black text-gray-900 leading-[1.1] tracking-tighter">
            Standar Baru <br/>
            <span className="text-blue-600 italic">Minibus Antar Kota.</span>
          </h2>
          <p className="text-gray-500 leading-relaxed text-base font-medium">
            Kami mengerti bahwa waktu dan kenyamanan adalah segalanya. 
            TripGo hadir dengan armada Mercedes-Benz Sprinter & Toyota Hiace 
            terbaru yang dirancang khusus untuk kenyamanan maksimal selama 
            perjalanan lintas kota di Jawa.
          </p>
          <div className="flex gap-8 py-4 border-y border-gray-100">
            <div>
              <p className="text-2xl font-black text-blue-900">15+</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kota Tujuan</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-900">100%</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Online Booking</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-900">24/7</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Care</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-blue-600 font-black text-sm uppercase tracking-widest group">
            Lihat Semua Rute 
            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </main>
  );
}