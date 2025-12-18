"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Ticket, Calendar, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth"; // Import hook auth Anda

function KonfirmasiContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth(); // Ambil data user yang sedang login
  const [step, setStep] = useState(1);

  const scheduleId = searchParams.get("schedule_id") || searchParams.get("id") || "";
  const seatCount = parseInt(searchParams.get("seat_count") || searchParams.get("passengers") || "1");
  const pricePerSeat = Number(searchParams.get("price") || 0);
  const totalPrice = pricePerSeat * seatCount;

  const data = {
    origin: searchParams.get("origin") || "-",
    destination: searchParams.get("destination") || "-",
    price: pricePerSeat,
    class: searchParams.get("class") || "Reguler",
    time: searchParams.get("time") || "--:--",
    date: searchParams.get("date") || "-",
    seat_count: seatCount,
    totalPrice: totalPrice,
  };

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
  });

  // LOGIKA AUTOFILL: Mengisi data dari akun user saat halaman dimuat
  useEffect(() => {
    if (user) {
      setFormData({
        nama: `${user.first_name} ${user.last_name || ""}`.trim(),
        email: user.email || "",
        telepon: user.phone || "", // Asumsi di model User ada kolom phone
      });
    }
  }, [user]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nama || !formData.email || !formData.telepon) {
        alert("Mohon lengkapi data diri Anda");
        return;
      }
      setStep(2);
    } else {
      const queryParams = new URLSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        schedule_id: scheduleId,
        customer_name: formData.nama,
        customer_email: formData.email,
        customer_phone: formData.telepon,
        seat_count: seatCount.toString(),
        total_price: totalPrice.toString(),
        // Tambahkan user_id agar backend bisa mencatat secara permanen
        user_id: user?.id?.toString() || "", 
      });

      router.push(`/pembayaran?${queryParams.toString()}`);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pt-28 pb-20 px-4 font-poppins">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-center text-gray-800 mb-5 uppercase tracking-tighter">
          Konfirmasi Pemesanan
        </h2>

        {/* Stepper Tab */}
        <div className="flex bg-white rounded-2xl p-2 shadow-sm mb-8 border border-gray-100">
          <button 
            onClick={() => setStep(1)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${step === 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
          >
            <User size={16} /> Data Pribadi
          </button>
          <button 
            disabled={!formData.nama}
            onClick={() => setStep(2)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${step === 2 ? 'bg-blue-50 text-blue-600' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}
          >
            <Ticket size={16} /> Detail Pemesanan
          </button>
        </div>

        {/* Step 1: Form Data Diri */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Lengkap</label>
              <input 
                type="text"
                placeholder="NAMA SESUAI IDENTITAS"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition font-bold text-gray-800 uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alamat Email</label>
              <input 
                type="email"
                readOnly // Email dikunci agar tetap sesuai akun
                placeholder="EMAIL@DOMAIN.COM"
                value={formData.email}
                className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none font-bold text-gray-500 cursor-not-allowed"
              />
              <p className="text-[9px] text-blue-500 font-bold italic ml-1">* Email otomatis menggunakan data akun Anda</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nomor Telepon</label>
              <input 
                type="tel"
                placeholder="08XX XXXX XXXX"
                value={formData.telepon}
                onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition font-bold text-gray-800"
              />
            </div>
          </div>
        )}

        {/* Step 2: Review Detail */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 animate-in slide-in-from-right-4 duration-300">
            {/* Tampilan Review Ticket yang sama seperti sebelumnya tapi dengan font Poppins */}
            <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-6">
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asal</p>
                <p className="text-lg font-black text-gray-800 uppercase italic">{data.origin}</p>
              </div>
              <div className="px-4 text-blue-500 animate-pulse">
                <Ticket size={24} />
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tujuan</p>
                <p className="text-lg font-black text-gray-800 uppercase italic">{data.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <div className="flex justify-between items-center bg-blue-50 p-5 rounded-2xl border border-blue-100 mt-2">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Penumpang</p>
                  <p className="font-black text-blue-900 uppercase">{formData.nama}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Total Bayar</p>
                  <p className="text-xl font-black text-blue-600">
                    {formatIDR(data.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          className="w-full mt-8 bg-orange-400 hover:bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-100 transition-all active:scale-95 hover:shadow-orange-200"
        >
          {step === 1 ? "Lanjutkan" : "Lanjut ke Pembayaran"}
        </button>
        
        {step === 2 && (
          <button 
            onClick={() => setStep(1)}
            className="w-full mt-4 text-gray-400 font-bold hover:text-gray-600 transition-colors text-[10px] uppercase tracking-widest"
          >
            ← Kembali Ubah Data Pribadi
          </button>
        )}
      </div>
    </main>
  );
}

export default function KonfirmasiPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase">Memuat Konfirmasi...</div>}>
      <KonfirmasiContent />
    </Suspense>
  );
}