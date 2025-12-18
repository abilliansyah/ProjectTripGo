"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

export default function NavbarApp() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const linkStyle = (path: string) => 
    `transition ${pathname === path ? "text-blue-900 font-bold" : "hover:text-blue-900"}`;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between font-poppins">
        {/* Logo */}
        <Link href="/" className="relative w-32 h-10">
          <Image src="/image/logo.png" alt="TripGo Logo" fill className="object-contain" priority />
        </Link>

        {/* Menu Navigasi */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700 uppercase tracking-tight">
          <Link href="/" className={linkStyle("/")}>Beranda</Link>
          <Link href="/reservasi" className={linkStyle("/reservasi")}>Reservasi</Link>
          <Link href="/history" className={linkStyle("/history")}>History</Link>
          <Link href="/cara-pembayaran" className={linkStyle("/cara-pembayaran")}>Cara Pembayaran</Link>
          <Link href="/outlet" className={linkStyle("/outlet")}>Outlet</Link>
          <Link href="/kontak" className={linkStyle("/kontak")}>Kontak</Link>
        </div>

        {/* Tombol Auth */}
        <div>
          {user ? (
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">SELAMAT DATANG</span>
                <span className="text-sm font-black text-blue-900 uppercase tracking-tighter">
                  {user.first_name}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase hover:bg-red-700 transition active:scale-95 shadow-md shadow-red-100"
              >
                Keluar
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-[#333] text-white px-6 py-2.5 rounded-lg text-sm font-black uppercase hover:bg-black transition active:scale-95"
            >
              Daftar/Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}