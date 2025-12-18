import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#15406A] text-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="relative w-32 h-12">
            <Image src="/image/logo.png" alt="TripGo Logo" fill className="object-contain invert brightness-0" />
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            Mulai perjalananmu bersama minibus TripGo yang siap menjemputmu tepat waktu. 
            Kemanapun arahmu, kami akan mendampingi.
          </p>
        </div>

        {/* Links Columns */}
        <div>
          <h4 className="font-bold text-lg mb-6">Informasi</h4>
          <ul className="space-y-3 text-sm text-blue-100">
            <li><Link href="#" className="hover:text-white transition">Website</Link></li>
            <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-white transition">Kontak</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Kontak</h4>
          <ul className="space-y-3 text-sm text-blue-100">
            <li>+6281-2345-6789</li>
            <li>kelompok1@gmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Outlet</h4>
          <p className="text-sm text-blue-100 leading-relaxed">
            Jl. Gunung Kupak Damkar RT 004/005, Joglo, Cilegon, Banten
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-blue-800 text-center text-xs text-blue-300">
        © 2024 TripGo - All Rights Reserved.
      </div>
    </footer>
  );
}