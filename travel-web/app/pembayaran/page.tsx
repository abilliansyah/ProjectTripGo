"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ChevronDown, Copy, CheckCircle2, Wallet, Building2, 
  Store, ArrowLeft, Zap, Loader2
} from "lucide-react";

// Helper untuk URL API agar dinamis saat hosting
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const paymentLogos: { [key: string]: string } = {
  bca: "/logos/bca.png",
  bni: "/logos/bni.png",
  bri: "/logos/bri.png",
  mandiri: "/logos/mandiri.png",
  permata: "/logos/permata.png",
  gopay: "/logos/gopay.png",
  shopeepay: "/logos/shopeepay.png",
  qris: "/logos/qris.png",
  alfamart: "/logos/alfamart.png",
  indomaret: "/logos/indomaret.png",
  akulaku: "/logos/akulaku.png",
  kredivo: "/logos/kredivo.png",
};

function PembayaranContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const data = {
    scheduleId: searchParams.get("schedule_id"), 
    price: Number(searchParams.get("price") || 0),
    seatCount: parseInt(searchParams.get("seat_count") || "1"),
    nama: searchParams.get("customer_name") || "Tamu",
    email: searchParams.get("customer_email") || "",
    telepon: searchParams.get("customer_phone") || "",
    userId: searchParams.get("user_id"),
  };

  const handleCharge = async (method: string, subMethod?: string) => {
    if (!data.scheduleId) return alert("ID Jadwal tidak ditemukan.");
    setLoadingMethod(subMethod || method);
    
    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
          alert("Sesi anda berakhir. Silakan login kembali.");
          router.push("/login");
          return;
      }

      // 1. Simpan pesanan ke Laravel (Railway)
      const resLaravel = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          user_id: data.userId,
          schedule_id: data.scheduleId,
          customer_name: data.nama,
          customer_email: data.email,
          customer_phone: data.telepon,
          seat_count: data.seatCount, 
          total_price: data.price * data.seatCount,
          payment_method: subMethod || method 
        })
      });

      const laravelResult = await resLaravel.json();
      
      if (resLaravel.status === 401) {
        alert("Sesi anda berakhir, silakan login kembali.");
        router.push("/login");
        return;
      }

      if (!resLaravel.ok) throw new Error(laravelResult.message || "Gagal membuat pesanan.");

      const orderId = laravelResult.data.order_id;

      // Simulasi TripGo Pay (Tanpa Midtrans)
      if (method === "tripgo_pay") {
        setPaymentData({ payment_type: "tripgo_pay", order_id: orderId });
        return;
      }

      // 2. Request Token ke API Route Next.js (Internal)
      const resMidtrans = await fetch("/tokenizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId, 
          method, 
          bank: subMethod, 
          price: data.price, 
          quantity: data.seatCount,
          customerDetails: { first_name: data.nama, email: data.email, phone: data.telepon }
        }),
      });
      
      const result = await resMidtrans.json();
      setPaymentData({ ...result, order_id: orderId, store: subMethod });

      // Jika ada redirect URL (seperti Gopay/ShopeePay/Kredivo)
      if (result.redirect_url) {
        setTimeout(() => { window.location.href = result.redirect_url; }, 1000);
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoadingMethod(null);
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    setIsChecking(true);
    try {
      const response = await fetch(`${API_URL}/bookings/status/${orderId}`);
      const result = await response.json();
      
      // Menangani status Midtrans (settlement/success)
      if (result.status === "pending") {
        alert("Pembayaran belum diterima. Mohon selesaikan transaksi anda.");
      } else if (["settlement", "success", "capture"].includes(result.status)) {
        alert("Pembayaran berhasil dikonfirmasi!");
        router.push(`/tiket-saya/${orderId}`);
      } else {
        alert(`Status pembayaran: ${result.status}`);
      }
    } catch (err) {
      alert("Gagal memeriksa status ke server.");
    } finally {
      setIsChecking(false);
    }
  };

  const AccordionItem = ({ id, title, icon: Icon, children, color }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all hover:shadow-md">
      <button onClick={() => setOpenAccordion(openAccordion === id ? null : id)} className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-500`}><Icon size={22} /></div>
          <span className="text-gray-700 text-sm font-bold tracking-tight">{title}</span>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform ${openAccordion === id ? "rotate-180" : ""}`} />
      </button>
      {openAccordion === id && <div className="p-4 bg-gray-50 border-t grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FBFBFB] pt-28 pb-20 px-4 font-poppins">
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 text-xs font-bold mb-8 hover:text-blue-600 transition uppercase tracking-widest">
          <ArrowLeft size={16} /> Kembali
        </button>

        {!paymentData ? (
          <>
            <div className="text-center mb-10">
               <h2 className="text-2xl text-gray-900 font-black italic tracking-tighter uppercase">Metode <span className="text-blue-600">Pembayaran</span></h2>
               <div className="inline-block mt-4 bg-white border border-blue-100 px-6 py-2 rounded-2xl shadow-sm">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Tagihan</p>
                 <p className="text-xl font-black text-blue-900 italic">{(data.price * data.seatCount).toLocaleString('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0})}</p>
               </div>
            </div>
            
            <AccordionItem id="va" title="Virtual Account (VA)" icon={Building2} color="blue">
              {["bca", "bni", "bri", "mandiri", "permata"].map((bank) => (
                <div key={bank} onClick={() => handleCharge("bank_transfer", bank)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-400 cursor-pointer transition-all active:scale-95">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[bank]} alt={bank} className="h-4 w-12 object-contain grayscale hover:grayscale-0 transition" />
                    <span className="text-gray-600 text-xs font-bold uppercase tracking-wider">Transfer {bank}</span>
                  </div>
                  {loadingMethod === bank ? <Loader2 className="animate-spin h-4 w-4 text-blue-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            <AccordionItem id="ew" title="E-Wallet & QRIS" icon={Wallet} color="orange">
              {["qris", "gopay", "shopeepay"].map((m) => (
                <div key={m} onClick={() => handleCharge(m)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-400 cursor-pointer transition-all active:scale-95">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[m]} alt={m} className="h-5 w-12 object-contain" />
                    <span className="text-gray-600 text-xs font-bold uppercase tracking-wider">{m}</span>
                  </div>
                  {loadingMethod === m ? <Loader2 className="animate-spin h-4 w-4 text-orange-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            <AccordionItem id="otc" title="Gerai Retail" icon={Store} color="green">
              {["alfamart", "indomaret"].map((m) => (
                <div key={m} onClick={() => handleCharge("cstore", m)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-green-400 cursor-pointer transition-all active:scale-95">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[m]} alt={m} className="h-4 w-12 object-contain" />
                    <span className="text-gray-600 text-xs font-bold uppercase tracking-wider uppercase">{m}</span>
                  </div>
                  {loadingMethod === m ? <Loader2 className="animate-spin h-4 w-4 text-green-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            <div onClick={() => handleCharge("tripgo_pay")} className="group mt-8 p-8 bg-blue-900 rounded-[2rem] text-white shadow-2xl shadow-blue-100 cursor-pointer flex justify-between items-center active:scale-[0.98] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                <Zap size={100} />
              </div>
              <div className="flex items-center gap-5 relative z-10">
                <div className="bg-white/10 p-4 rounded-2xl"><Zap size={24} className="text-orange-400" /></div>
                <div>
                  <p className="text-xl font-black italic tracking-tighter uppercase">TripGo Pay</p>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Konfirmasi Instan & Otomatis</p>
                </div>
              </div>
              {loadingMethod === "tripgo_pay" ? <Loader2 className="animate-spin h-6 w-6" /> : <span className="bg-orange-500 text-white text-[10px] px-5 py-2.5 rounded-xl font-black uppercase tracking-widest italic group-hover:bg-white group-hover:text-blue-900 transition-colors">Bayar</span>}
            </div>
          </>
        ) : (
          <div className={`p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] text-white transition-all animate-in zoom-in-95 duration-300 ${paymentData.payment_type === "tripgo_pay" ? "bg-green-600" : "bg-blue-800"}`}>
            <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Instruksi Pembayaran</h3>
              </div>
              <button onClick={() => setPaymentData(null)} className="text-[9px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full hover:bg-black/40 transition">Batal</button>
            </div>

            {paymentData.payment_type === "tripgo_pay" ? (
              <div className="text-center space-y-8 py-10 font-poppins">
                <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto ring-8 ring-white/5 animate-bounce"><CheckCircle2 size={48} /></div>
                <div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">Berhasil!</h3>
                  <p className="text-xs opacity-70 mt-2 font-bold uppercase tracking-widest">Saldo TripGo Pay Terpotong</p>
                </div>
                <button onClick={() => router.push(`/tiket-saya/${paymentData.order_id}`)} className="w-full bg-white text-green-700 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Terbitkan Tiket Saya</button>
              </div>
            ) : (
              <div className="space-y-10 text-center font-poppins">
                {/* QRIS SECTION */}
                {paymentData.actions?.find((a: any) => a.name === "generate-qr-code") && (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] inline-block shadow-2xl ring-8 ring-black/5">
                      <img src={paymentData.actions.find((a: any) => a.name === "generate-qr-code").url} alt="QRIS" className="w-56 h-56" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Scan QRIS melalui aplikasi M-Banking / E-Wallet</p>
                  </div>
                )}

                {/* VA / PAYMENT CODE SECTION */}
                {(paymentData.va_numbers || paymentData.payment_code) && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Kode Bayar / Virtual Account</p>
                    <div className="bg-black/20 p-6 rounded-[1.5rem] border border-white/10 flex justify-between items-center group">
                      <span className="text-3xl font-black tracking-widest italic">
                        {paymentData.payment_code || paymentData.va_numbers[0].va_number}
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(paymentData.payment_code || paymentData.va_numbers[0].va_number);
                          alert("Berhasil disalin.");
                        }}
                        className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-6">
                  <button 
                    onClick={() => checkPaymentStatus(paymentData.order_id)} 
                    disabled={isChecking}
                    className="w-full bg-orange-500 text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl flex justify-center items-center gap-3 hover:bg-orange-600 transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isChecking ? <Loader2 className="animate-spin" /> : "Cek Status Pembayaran"}
                  </button>
                  <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Otomatis dialihkan jika pembayaran diterima</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function PembayaranPage() { 
  return (
    <Suspense fallback={
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#FBFBFB]">
        <Loader2 className="animate-spin text-blue-900" size={40} />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest tracking-widest">Menyiapkan Gerbang Pembayaran...</p>
      </div>
    }>
      <PembayaranContent />
    </Suspense>
  ); 
}