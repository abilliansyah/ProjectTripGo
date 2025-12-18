"use client";

import React from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Send,
  MessageSquare,
  Mail
} from "lucide-react";

export default function KontakPage() {
  // URL Embed Google Maps yang sudah diarahkan ke FT UNTIRTA Cilegon
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.653303681498!2d106.0320803147682!3d-5.996345295656914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e418e2782651571%3A0x299411dd80bfb66e!2sFakultas%20Teknik%20UNTIRTA!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20 font-poppins text-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-900 mb-4 tracking-tight uppercase">Hubungi Kami</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Gunakan informasi di bawah ini untuk menghubungi tim TripGo atau kirimkan pesan langsung melalui formulir yang tersedia.
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5 hover:border-blue-500 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
              <MapPin className="text-blue-600" size={28} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Kantor Pusat</h3>
              <p className="text-gray-800 font-semibold leading-relaxed text-sm">
                Jl. Jend. Sudirman No.KM. 3, Kotabumi, Kec. Purwakarta, Kota Cilegon, Banten 42435
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5 hover:border-green-500 transition-all duration-300">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
              <Phone className="text-green-600" size={28} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Customer Service</h3>
              <p className="text-gray-800 font-bold text-lg">+62 254 376712</p>
              <p className="text-gray-500 text-xs mt-1">Senin - Sabtu (Jam Kerja)</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-5 hover:border-orange-500 transition-all duration-300">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex-shrink-0 flex items-center justify-center">
              <Clock className="text-orange-600" size={28} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Jam Operasional</h3>
              <p className="text-gray-800 font-semibold">Senin - Jumat: 07:30 - 16:30</p>
              <p className="text-gray-600 text-sm">Sabtu: 07:00 - 17:00 WIB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Formulir Kontak */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <MessageSquare size={22} />
              </div>
              {/* SOFT FONT: Kirim Pesan */}
              <h2 className="text-2xl font-semibold text-gray-800">Kirim Pesan</h2>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-sm" placeholder="Nama anda" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
                  <input type="email" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-sm" placeholder="email@gmail.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pesan atau Pertanyaan</label>
                <textarea rows={5} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-sm resize-none" placeholder="Tuliskan pesan anda di sini..."></textarea>
              </div>

              {/* SOFT FONT: Kirim Sekarang */}
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                <Send size={18} /> Kirim Sekarang
              </button>
            </form>
          </div>

          {/* Maps Section */}
          <div className="flex flex-col">
            <div className="flex-1 min-h-[450px] rounded-[2.5rem] overflow-hidden border-8 border-white shadow-xl relative">
              <iframe 
                src={mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fakultas Teknik UNTIRTA"
              ></iframe>
            </div>
            
            <div className="mt-6 p-6 bg-blue-900 rounded-3xl text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Email Support</p>
                  <p className="font-bold text-sm">support@tripgo.com</p>
                </div>
              </div>
              <button onClick={() => window.open('https://maps.app.goo.gl/3fR9Rz8Xp6X8X8X8X', '_blank')} className="bg-white text-blue-900 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-tighter hover:bg-gray-100 transition-colors">
                Buka di Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}