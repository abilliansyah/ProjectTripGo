// app/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => (
    <footer className="bg-gray-900 text-white mt-32 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-8">
            
            {/* Kolom 1: Logo & Deskripsi */}
            <div className="w-full md:w-1/4">
                <h3 className="text-2xl font-extrabold mb-4 text-[#FF7A00]">TripGo</h3>
                <p className="text-gray-400 text-sm">
                    Mulai perjalananmu bersama minibus TripGo yang selalu mendampingi setiap waktu. Kenyamanan penumpang utama kami adalah mendampingi.
                </p>
            </div>
            
            {/* Kolom 2 & 3: Info & Kontak */}
            <div className="flex w-full md:w-1/2 justify-around">
                <div>
                    <h4 className="text-lg font-semibold mb-4">Informasi</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-[#FF7A00] transition">Website</a></li>
                        <li><a href="#" className="hover:text-[#FF7A00] transition">Blog</a></li>
                        <li><a href="#" className="hover:text-[#FF7A00] transition">Karir</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Kontak</h4>
                    <p className="text-sm text-gray-400">**+6281-2345-6789**</p>
                    <p className="text-sm text-gray-400">**kontak@tripgo.com**</p>
                </div>
            </div>

            {/* Kolom 4: Outlet */}
            <div className="w-full md:w-1/4">
                <h4 className="text-lg font-semibold mb-4">Outlet</h4>
                <p className="text-sm text-gray-400">Jl. Gunung Tupak Domtor No. 50A, Bogor, Cilegon, Banten</p>
            </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-700 pt-4">
            <h5 className="font-bold mb-2 text-gray-300">Ikuti Media Sosial TripGo</h5>
            <p>&copy; {new Date().getFullYear()} TripGo. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;