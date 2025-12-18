"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Store, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2,
  Wallet
} from "lucide-react";

export default function CaraPembayaranPage() {
  const [activeTab, setActiveTab] = useState<string | null>("atm");

  const toggleAccordion = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const paymentMethods = [
    {
      id: "atm",
      title: "ATM, Mobile Banking & Internet Banking",
      icon: <CreditCard className="text-blue-600" size={24} />,
      content: [
        {
          bank: "Bank Mandiri",
          steps: [
            "Pilih menu 'Bayar/Beli' pada ATM atau App Mandiri",
            "Pilih 'Multipayment'",
            "Masukkan Kode Perusahaan Midtrans (70012)",
            "Masukkan Kode Pembayaran yang tertera pada aplikasi TripGo",
            "Konfirmasi nominal dan selesaikan transaksi"
          ]
        },
        {
          bank: "Bank BCA",
          steps: [
            "Pilih 'Transfer' > 'BCA Virtual Account'",
            "Masukkan Nomor Virtual Account yang muncul",
            "Pastikan nama 'Midtrans - TripGo' muncul",
            "Selesaikan pembayaran"
          ]
        },
        {
          bank: "Bank BNI",
          steps: [
            "Pilih 'Menu Lain' > 'Transfer'",
            "Pilih 'Virtual Account Billing'",
            "Masukkan Nomor Virtual Account",
            "Konfirmasi dan bayar"
          ]
        }
      ]
    },
    {
      id: "ewallet",
      title: "E-Wallet / Instant Payment",
      icon: <Smartphone className="text-orange-500" size={24} />,
      content: [
        {
          bank: "Gopay / ShopeePay / QRIS",
          steps: [
            "Pilih metode QRIS pada halaman pembayaran",
            "Simpan QR Code atau scan langsung",
            "Buka aplikasi e-wallet pilihan Anda",
            "Selesaikan transaksi dan simpan bukti bayar"
          ]
        }
      ]
    },
    {
      id: "retail",
      title: "Retail / Offline Store",
      icon: <Store className="text-green-600" size={24} />,
      content: [
        {
          bank: "Indomaret / Alfamart",
          steps: [
            "Tunjukkan Kode Pembayaran ke kasir",
            "Lakukan pembayaran sesuai nominal",
            "Simpan struk fisik sebagai bukti transaksi sah"
          ]
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-20 font-poppins">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instruksi Pembayaran</h1>
          <p className="text-gray-500 text-sm">Semua pembayaran diproses secara aman melalui Midtrans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Menu Accordion */}
          <div className="lg:col-span-5 space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => toggleAccordion(method.id)}
                className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all duration-300 ${
                  activeTab === method.id 
                  ? "bg-white border-blue-500 shadow-xl shadow-blue-50" 
                  : "bg-white border-transparent shadow-sm hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${activeTab === method.id ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    {method.icon}
                  </div>
                  <span className="text-sm font-bold text-gray-700 text-left">{method.title}</span>
                </div>
                {activeTab === method.id ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-gray-400" />}
              </button>
            ))}
          </div>

          {/* Details Content */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 min-h-[500px]">
              {activeTab ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <CheckCircle2 className="text-blue-600" />
                    Cara Membayar
                  </h2>
                  
                  <div className="space-y-10">
                    {paymentMethods.find(m => m.id === activeTab)?.content.map((item, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-dashed border-gray-100">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-50"></div>
                        <h3 className="font-bold text-blue-900 mb-4">{item.bank}</h3>
                        <ul className="space-y-4">
                          {item.steps.map((step, sIdx) => (
                            <li key={sIdx} className="flex gap-4 text-sm text-gray-600 leading-relaxed">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                {sIdx + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                  <Wallet size={64} className="mb-4 text-gray-300" />
                  <p className="text-gray-400 font-medium italic">Pilih metode pembayaran di samping untuk melihat detail instruksi</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}