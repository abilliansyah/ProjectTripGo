// app/page.tsx
/**
 * Catatan:
 * 1. Navbar harusnya diimpor di app/layout.tsx untuk ditampilkan di semua halaman.
 * 2. Saya mengasumsikan ImageWithFallback dan SearchForm diimpor dari folder components.
 * 3. Ganti URL gambar dengan path lokal Anda di public/images (misal: "/images/hero-bali.jpg").
 */
import React from 'react';
import Image from 'next/image'; // Next.js Image component untuk optimasi

// Import komponen yang sudah Anda definisikan (disesuaikan dengan path Anda)
import SearchForm from '@/components/SearchForm'; // Asumsi: Anda memindahkannya ke components/SearchForm.tsx
import Footer from '@/components/Footer'; // Asumsi: Anda memindahkannya ke components/Footer.tsx

// --- Client Component untuk Image (menggunakan ImageWithFallback jika perlu) ---
// Jika Anda ingin menggunakan ImageWithFallback, Anda harus menjadikannya Client Component,
// atau gunakan Image bawaan Next.js untuk performa terbaik.
// Karena kita tidak memiliki ImageWithFallback di sini, kita gunakan Image standar.
// *GANTI DENGAN KOMPONEN ImageWithFallback ANDA JIKA PERLU*

interface SectionImageProps {
    src: string;
    alt: string;
    className: string;
}

const SectionImage: React.FC<SectionImageProps> = ({ src, alt, className }) => (
    <div className={className}>
        {/* Menggunakan Image dari Next.js untuk optimasi */}
        <Image 
            src={src} 
            alt={alt} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-xl"
        />
    </div>
);


const HomePage: React.FC = () => {
    // Definisi warna utama: Biru Tua (#15406A) dan Oranye (#FF7A00)

    return (
        <div className="min-h-screen bg-white font-sans">
            <main>
                
                {/* === 1. Hero Section === */}
                <div className="relative pt-16 pb-40 bg-gray-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            {/* Judul & Deskripsi */}
                            <h1 className="text-4xl font-extrabold text-[#15406A] sm:text-5xl lg:text-6xl tracking-tight">
                                TripGo
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 max-w-4xl mx-auto">
                                Trip Go adalah platform perjalanan dan transportasi modern yang dirancang untuk menemani setiap perjalanan Anda. Kami menyediakan layanan minibus dengan menghadirkan pengalaman pemesanan yang mudah, aman, dan nyaman. Trip Go melayani rute utama **Cilegon - Serang - Rangkasbitung - Tanahabang.**
                            </p>
                        </div>
                        
                        {/* Gambar Hero (Pemandangan) */}
                        <div className="shadow-2xl rounded-xl overflow-hidden max-w-5xl mx-auto h-72 sm:h-96 relative">
                            <SectionImage
                                // GANTI DENGAN PATH LOKAL ANDA: "/images/hero-bali.jpg"
                                src="/image/hero-bali.jpg" 
                                alt="Pemandangan indah" 
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                    
                    {/* Search Form (PENTING: Pastikan ini adalah Client Component) */}
                    {/* Kami menggunakan komponen SearchForm Anda di sini */}
                    <SearchForm /> 
                </div>
                
                {/* === 2. Section Tentang TripGo === */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 py-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Tentang TripGo</h2>
                    
                    <div className="flex flex-wrap items-center lg:flex-row-reverse gap-10">
                        {/* Kolom Gambar Bus */}
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl shadow-2xl relative w-full h-72">
                                <SectionImage 
                                    // GANTI DENGAN PATH LOKAL ANDA: "/images/tripgo-bus.png"
                                    src="/image/tripgo-bus.png"
                                    alt="Bus TripGo modern" 
                                    className="w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Kolom Teks */}
                        <div className="w-full lg:w-1/2">
                            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                                TripGo telah dipercaya oleh banyak penumpang sebagai solusi perjalanan antar kota yang aman dan nyaman. Kami menyediakan berbagai jenis minibus modern dengan fasilitas lengkap seperti **AC dingin, kursi ergonomis, charger port,** dan **hiburan** selama perjalanan, memastikan setiap perjalanan terasa menyenangkan.
                            </p>
                            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                                Dengan harga tiket yang terjangkau dan sistem pemesanan yang mudah, TripGo berkomitmen untuk memberikan pengalaman terbaik bagi setiap pelanggan.
                            </p>
                            <p className="text-[#15406A] font-extrabold text-xl mt-6">
                                Nikmati perjalanan tanpa khawatir bersama TripGo.
                            </p>
                        </div>
                    </div>
                </section>
                
            </main>
            
            {/* Footer diimpor dari komponen terpisah */}
            <Footer />
        </div>
    );
}

export default HomePage;