"use client";

import React, { useState } from "react";
import { MapPin, Phone, Search, Navigation, Building2, Map as MapIcon } from "lucide-react";

// Data Outlet disinkronkan dengan 15 kota di database/halaman utama
const outletData = [
  { id: 1, city: "CILEGON", name: "Outlet Pusat Cilegon", address: "Jl. Jend. Sudirman No.KM. 3, Kotabumi, Cilegon", phone: "0813-8352-6817", type: "Pusat" },
  { id: 2, city: "SERANG", name: "Outlet Serang Ciwaru", address: "Jl. Ciwaru Raya No. 12, Cipare, Serang", phone: "0857-1163-6772", type: "Cabang" },
  { id: 3, city: "TANGERANG", name: "Outlet Tangerang Kota", address: "Jl. Benteng Betawi, Poris Plawad, Tangerang", phone: "0812-9988-7766", type: "Cabang" },
  { id: 4, city: "JAKARTA", name: "Outlet Jakarta Pusat", address: "Jl. Jati Baru Raya, Tanah Abang, Jakarta Pusat", phone: "0895-7717-8303", type: "Cabang" },
  { id: 5, city: "BOGOR", name: "Outlet Bogor Baranangsiang", address: "Jl. Pajajaran No. 3, Bogor Timur, Bogor", phone: "0811-2233-4455", type: "Cabang" },
  { id: 6, city: "BANDUNG", name: "Outlet Bandung Pasteur", address: "Jl. Dr. Djunjunan No. 125, Pasteur, Bandung", phone: "0821-4455-6677", type: "Cabang" },
  { id: 7, city: "CIREBON", name: "Outlet Cirebon Kejaksan", address: "Jl. Kartini No. 7, Kejaksan, Cirebon", phone: "0819-0011-2233", type: "Cabang" },
  { id: 8, city: "TEGAL", name: "Outlet Tegal Pacific", address: "Jl. Mayjend Sutoyo, Tegal Barat, Tegal", phone: "0852-3344-5566", type: "Cabang" },
  { id: 9, city: "PEKALONGAN", name: "Outlet Pekalongan Kota", address: "Jl. Gajah Mada No. 10, Pekalongan Barat", phone: "0877-6677-8899", type: "Cabang" },
  { id: 10, city: "SEMARANG", name: "Outlet Semarang Poncol", address: "Jl. Imam Bonjol, Semarang Utara, Semarang", phone: "0813-9900-1122", type: "Cabang" },
  { id: 11, city: "SALATIGA", name: "Outlet Salatiga Sudirman", address: "Jl. Jend. Sudirman No. 45, Sidorejo, Salatiga", phone: "0856-1122-3344", type: "Cabang" },
  { id: 12, city: "SOLO", name: "Outlet Solo Balapan", address: "Jl. Gajah Mada, Banjarsari, Solo", phone: "0812-5566-7788", type: "Cabang" },
  { id: 13, city: "YOGYAKARTA", name: "Outlet Jogja Tugu", address: "Jl. P. Mangkubumi No. 1, Jetis, Yogyakarta", phone: "0818-7788-9900", type: "Cabang" },
  { id: 14, city: "MADIUN", name: "Outlet Madiun Kota", address: "Jl. Pahlawan No. 20, Kartoharjo, Madiun", phone: "0852-0099-8877", type: "Cabang" },
  { id: 15, city: "SURABAYA", name: "Outlet Surabaya Gubeng", address: "Jl. Stasiun Gubeng No. 1, Genteng, Surabaya", phone: "0811-3344-5566", type: "Cabang" },
];

export default function OutletPage() {
  const [filter, setFilter] = useState("");

  const filteredOutlets = outletData.filter((item) =>
    item.city.toLowerCase().includes(filter.toLowerCase()) ||
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] pt-28 pb-20 font-poppins">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center md:text-left mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
            <MapIcon size={14} /> Jaringan Outlet TripGo
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Lokasi Outlet</h1>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            Outlet kami tersebar di berbagai tempat di Pulau Jawa. Pilih lokasi terdekat untuk melakukan pemesanan langsung, check-in, atau mendapatkan informasi lebih lanjut.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Cari berdasarkan kota (Cth: Surabaya, Solo...)"
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="hidden md:block text-xs font-bold text-gray-400 px-4 uppercase tracking-widest">
            Total {filteredOutlets.length} Lokasi
          </div>
        </div>

        {/* Grid Outlets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOutlets.map((outlet) => (
            <div 
              key={outlet.id} 
              className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                  <Building2 size={28} />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  outlet.type === 'Pusat' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {outlet.type}
                </span>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest">{outlet.city}</h3>
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{outlet.name}</h2>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-1 bg-gray-50 rounded-md text-gray-400 group-hover:text-blue-500">
                    <MapPin size={16} />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium italic">{outlet.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-1 bg-gray-50 rounded-md text-gray-400 group-hover:text-green-500">
                    <Phone size={16} />
                  </div>
                  <p className="text-xs text-gray-700 font-bold tracking-tight">{outlet.phone}</p>
                </div>
              </div>

              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(outlet.name + " " + outlet.city)}`, '_blank')}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 shadow-lg shadow-gray-200 hover:shadow-blue-200 transition-all active:scale-95"
              >
                <Navigation size={14} />
                Lihat di Peta
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOutlets.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <Search className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-medium italic">Kota yang Anda cari belum tersedia...</p>
          </div>
        )}
      </div>
    </main>
  );
}