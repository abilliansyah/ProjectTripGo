"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ChevronDown, Copy, CheckCircle2, Wallet, Building2, 
  Store, ArrowLeft, Zap, Loader2
} from "lucide-react";

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
    scheduleId: searchParams.get("schedule_id") || searchParams.get("id"), 
    price: Number(searchParams.get("price") || 0),
    seatCount: parseInt(searchParams.get("seat_count") || "1"),
    nama: searchParams.get("customer_name") || "Tamu",
    email: searchParams.get("customer_email") || "",
    telepon: searchParams.get("customer_phone") || "",
  };

  const handleCharge = async (method: string, subMethod?: string) => {
    if (!data.scheduleId) return alert("ID Jadwal tidak ditemukan.");
    setLoadingMethod(subMethod || method);
    
    try {
      const token = localStorage.getItem("token"); 
      const userIdFromURL = searchParams.get("user_id");

      if (!token) {
          alert("Sesi anda berakhir. Silakan login kembali.");
          router.push("/login");
          return;
      }

      // 1. Simpan pesanan ke Laravel
      const resLaravel = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          user_id: userIdFromURL,
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

      if (method === "tripgo_pay") {
        setPaymentData({ payment_type: "tripgo_pay", order_id: orderId });
        return;
      }

      // 2. Request Token ke Midtrans (API Route Next.js)
      const resMidtrans = await fetch("/api/tokenizer", {
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
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/status/${orderId}`);
      const result = await response.json();
      const currentStatus = result.status;

      if (currentStatus === "pending") {
        alert("Pembayaran belum diterima. Mohon selesaikan transaksi anda.");
      } else {
        alert("Pembayaran berhasil!");
        router.push(`/tiket-saya/${orderId}`);
      }
    } catch (err) {
      alert("Gagal memeriksa status.");
    } finally {
      setIsChecking(false);
    }
  };

  const AccordionItem = ({ id, title, icon: Icon, children, color }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 transition-all">
      <button onClick={() => setOpenAccordion(openAccordion === id ? null : id)} className="w-full p-5 flex justify-between items-center hover:bg-gray-50 transition">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl bg-${color}-50`}><Icon className={`text-${color}-500`} size={22} /></div>
          <span className="text-gray-700 text-sm font-medium">{title}</span>
        </div>
        <ChevronDown className={`text-gray-400 transition-transform ${openAccordion === id ? "rotate-180" : ""}`} />
      </button>
      {openAccordion === id && <div className="p-4 bg-gray-50 border-t grid grid-cols-1 gap-3">{children}</div>}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] pt-28 pb-20 px-4 font-poppins">
      <div className="max-w-xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 text-sm mb-6 hover:text-gray-700 transition">
          <ArrowLeft size={16} /> Kembali
        </button>

        {!paymentData ? (
          <>
            <div className="text-center mb-10">
               <h2 className="text-2xl text-gray-800 font-medium">Metode Pembayaran</h2>
               <div className="inline-block mt-3 bg-blue-50 px-4 py-1.5 rounded-full text-blue-600 text-sm font-medium">
                 Total Bayar: {(data.price * data.seatCount).toLocaleString('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0})}
               </div>
            </div>
            
            {/* VIRTUAL ACCOUNT */}
            <AccordionItem id="va" title="Virtual Account" icon={Building2} color="blue">
              {["bca", "bni", "bri", "mandiri", "permata"].map((bank) => (
                <div key={bank} onClick={() => handleCharge("bank_transfer", bank)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-400 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[bank]} alt={bank} className="h-4 w-12 object-contain" />
                    <span className="text-gray-600 text-sm">Transfer {bank.toUpperCase()}</span>
                  </div>
                  {loadingMethod === bank ? <Loader2 className="animate-spin h-4 w-4 text-blue-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            {/* E-WALLET */}
            <AccordionItem id="ew" title="E-Wallet & QRIS" icon={Wallet} color="orange">
              {["qris", "gopay", "shopeepay"].map((m) => (
                <div key={m} onClick={() => handleCharge(m)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-orange-400 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[m]} alt={m} className="h-4 w-12 object-contain" />
                    <span className="text-gray-600 text-sm">{m.charAt(0).toUpperCase() + m.slice(1)}</span>
                  </div>
                  {loadingMethod === m ? <Loader2 className="animate-spin h-4 w-4 text-orange-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            {/* RETAIL OUTLET (ALFAMART/INDOMARET) */}
            <AccordionItem id="otc" title="Gerai Retail" icon={Store} color="green">
              {["alfamart", "indomaret"].map((m) => (
                <div key={m} onClick={() => handleCharge("cstore", m)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-green-400 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[m]} alt={m} className="h-4 w-12 object-contain" />
                    <span className="text-gray-600 text-sm uppercase">{m}</span>
                  </div>
                  {loadingMethod === m ? <Loader2 className="animate-spin h-4 w-4 text-green-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            {/* PAYLATER */}
            <AccordionItem id="pl" title="Paylater" icon={Zap} color="purple">
              {["akulaku", "kredivo"].map((m) => (
                <div key={m} onClick={() => handleCharge(m)} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-400 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <img src={paymentLogos[m]} alt={m} className="h-4 w-12 object-contain" />
                    <span className="text-gray-600 text-sm uppercase">{m}</span>
                  </div>
                  {loadingMethod === m ? <Loader2 className="animate-spin h-4 w-4 text-purple-500" /> : <ChevronDown className="-rotate-90 text-gray-300" size={14} />}
                </div>
              ))}
            </AccordionItem>

            {/* TRIPGO PAY */}
            <div onClick={() => handleCharge("tripgo_pay")} className="mt-8 p-6 bg-blue-600 rounded-3xl text-white shadow-lg cursor-pointer flex justify-between items-center active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl"><CheckCircle2 /></div>
                <div>
                  <p className="text-lg font-medium">TripGo Pay</p>
                  <p className="text-xs opacity-80">Konfirmasi instan</p>
                </div>
              </div>
              {loadingMethod === "tripgo_pay" ? <Loader2 className="animate-spin h-6 w-6" /> : <span className="bg-white text-blue-600 text-xs px-4 py-2 rounded-full font-medium">Bayar Sekarang</span>}
            </div>
          </>
        ) : (
          /* TAMPILAN INSTRUKSI BAYAR */
          <div className={`p-10 rounded-[2.5rem] shadow-xl text-white transition-all ${paymentData.payment_type === "tripgo_pay" ? "bg-green-600" : "bg-blue-700"}`}>
            <div className="flex justify-between items-center border-b border-white/20 pb-5 mb-8">
              <h3 className="text-sm">Instruksi Pembayaran</h3>
              <button onClick={() => setPaymentData(null)} className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20">Batal</button>
            </div>

            {paymentData.payment_type === "tripgo_pay" ? (
              <div className="text-center space-y-6 py-6 font-poppins">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={32} /></div>
                <h3 className="text-2xl font-medium">Pembayaran Berhasil</h3>
                <button onClick={() => router.push(`/tiket-saya/${paymentData.order_id}`)} className="w-full bg-white text-green-700 py-4 rounded-2xl font-medium text-sm">Lihat Tiket Saya</button>
              </div>
            ) : (
              <div className="space-y-8 text-center font-poppins">
                {/* QR CODE */}
                {paymentData.actions?.find((a: any) => a.name === "generate-qr-code") && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-3xl inline-block">
                      <img src={paymentData.actions.find((a: any) => a.name === "generate-qr-code").url} alt="QRIS" className="w-48 h-48" />
                    </div>
                    <p className="text-xs opacity-80">Silakan scan kode QR di atas</p>
                  </div>
                )}

                {/* VA / PAYMENT CODE */}
                {(paymentData.va_numbers || paymentData.payment_code) && (
                  <div className="space-y-4">
                    <p className="text-xs text-blue-100">Kode Bayar / Virtual Account</p>
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                      <span className="text-2xl font-mono">
                        {paymentData.payment_code || paymentData.va_numbers[0].va_number}
                      </span>
                      <Copy className="cursor-pointer hover:text-white/70" onClick={() => {
                        navigator.clipboard.writeText(paymentData.payment_code || paymentData.va_numbers[0].va_number);
                        alert("Berhasil disalin.");
                      }} />
                    </div>
                  </div>
                )}

                <div className="space-y-3 pt-6">
                  <button 
                    onClick={() => checkPaymentStatus(paymentData.order_id)} 
                    disabled={isChecking}
                    className="w-full bg-white text-blue-700 py-4 rounded-2xl font-medium flex justify-center items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 text-sm"
                  >
                    {isChecking ? <Loader2 className="animate-spin" /> : "Saya Sudah Bayar"}
                  </button>
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
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-400">Memuat halaman...</div>}>
      <PembayaranContent />
    </Suspense>
  ); 
}