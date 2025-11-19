"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="@/public/image/logo-tripgo.png"   // <-- sesuaikan path: /public/image/logo-tripgo.png
                alt="TripGo"
                width={140}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Center: desktop nav links */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Beranda
            </Link>
            <Link href="/reservasi" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Reservasi
            </Link>
            <Link href="/cara-pembayaran" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Cara Pembayaran
            </Link>
            <Link href="/kontak" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Kontak
            </Link>
          </nav>

          {/* Right: auth buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  Hi, {<p>{user?.first_name} {user?.last_name}</p>}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex">
                <Link
                  href="/login"
                  className="px-4 py-2 bg-[#15406A] text-white rounded-lg text-sm font-medium hover:bg-[#12385e] transition-shadow shadow"
                >
                  Daftar / Masuk
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link href="/" className="block text-gray-700 font-medium py-2">
              Beranda
            </Link>
            <Link href="/reservasi" className="block text-gray-700 font-medium py-2">
              Reservasi
            </Link>
            <Link href="/cara-pembayaran" className="block text-gray-700 font-medium py-2">
              Cara Pembayaran
            </Link>
            <Link href="/kontak" className="block text-gray-700 font-medium py-2">
              Kontak
            </Link>

            <div className="pt-2 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block py-2 text-gray-700">
                    Hi, {user?.first_name || "User"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="block mt-2 px-4 py-2 bg-[#15406A] text-white rounded-md text-center">
                  Daftar / Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
