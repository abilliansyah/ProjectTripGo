import Navbar from '@/components/Navbar';
import SearchForm from '@/components/SearchForm';
import Link from 'next/link';
import ImageWithFallback from '@/components/ImageWithFallback'; // Mengatasi masalah onError

// Component untuk Footer agar halaman terlihat lengkap (Server Component)
const Footer = () => (
  <footer className="bg-gray-800 text-white mt-32 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-8">
      
      {/* Kolom 1: Logo & Deskripsi */}
      <div className="w-full md:w-1/4">
        <h3 className="text-2xl font-bold mb-4">TripGo</h3>
        <p className="text-gray-400 text-sm">
          Mulai perjalananmu bersama minibus TripGo yang selalu mendampingi setiap waktu. Kenyamanan penumpang utama kami adalah mendampingi.
        </p>
      </div>
      
      {/* Kolom 2 & 3: Info & Kontak */}
      <div className="flex w-full md:w-1/2 justify-around">
        <div>
          <h4 className="text-lg font-semibold mb-4">Informasi</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">Website</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Karir</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Kontak</h4>
          <p className="text-sm text-gray-400">+6281-2245-6789</p>
          <p className="text-sm text-gray-400">kontak@tripgo.com</p>
        </div>
      </div>

      {/* Kolom 4: Outlet */}
      <div className="w-full md:w-1/4">
        <h4 className="text-lg font-semibold mb-4">Outlet</h4>
        <p className="text-sm text-gray-400">Jl. Gunung Tupak Domtor No. 50A, Bogor, Cilegon, Banten</p>
      </div>
    </div>
    
    <div className="mt-8 text-center text-gray-500 text-sm">
      <h5 className="font-semibold mb-2">Ikuti Media Sosial TripGo</h5>
      {/* Anda bisa menambahkan ikon sosmed di sini */}
      <p>&copy; {new Date().getFullYear()} TripGo. All rights reserved.</p>
    </div>
  </footer>
);

export default function Home() {
  return (
    <>
      {/* Navbar diasumsikan adalah Client Component jika memiliki interaktivitas, atau Server Component jika hanya tampilan */}
      <main className="min-h-screen">
        {/* Hero Section */}
        <div className="relative pt-12 pb-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                TripGo
              </h1>
              <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
                Trip Go adalah platform perjalanan dan transportasi modern yang dirancang untuk menemani setiap perjalanan Anda. Kami menyediakan layanan minibus dengan menghadirkan pengalaman pemesanan yang mudah, aman, dan nyaman. Trip Go melayani rute Cilegon - Serang - Rangkasbitung - Tanahabang.
              </p>
            </div>
            
            {/* Image Placeholder menggunakan ImageWithFallback (Client Component) */}
            <div className="shadow-2xl rounded-xl overflow-hidden max-w-5xl mx-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1543793757-1944e8c1e403?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Pemandangan indah" 
                className="w-full h-80 object-cover"
                fallbackSrc="https://placehold.co/1000x320/007bff/ffffff?text=TripGo+Image"
              />
            </div>
          </div>
          
          {/* SearchForm diasumsikan adalah Client Component */}
          <SearchForm />
        </div>
        
        {/* Section Tentang Kami */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Tentang TripGo</h2>
          <div className="flex flex-wrap items-center gap-10">
            <div className="w-full lg:w-1/2">
              <p className="text-gray-600 mb-4">
                TripGo telah dipercaya oleh banyak penumpang sebagai solusi perjalanan antar kota yang aman dan nyaman. Kami menyediakan berbagai jenis minibus modern dengan fasilitas lengkap seperti AC dingin, kursi ergonomis, charger port, dan hiburan selama perjalanan, memastikan setiap perjalanan terasa menyenangkan. Dengan harga tiket yang terjangkau dan sistem pemesanan yang mudah, TripGo berkomitmen untuk memberikan pengalaman terbaik bagi setiap pelanggan.
              </p>
              <p className="text-gray-600 font-semibold">
                Nikmati perjalanan tanpa khawatir bersama TripGo.
              </p>
            </div>
            <div className="w-full lg:w-5/12">
              {/* Gambar Bus Placeholder menggunakan ImageWithFallback */}
              <ImageWithFallback 
                src="https://placehold.co/400x250/1f2937/ffffff?text=Bus+TripGo"
                alt="Bus TripGo modern" 
                className="rounded-xl shadow-lg w-full"
                fallbackSrc="https://placehold.co/400x250/1f2937/ffffff?text=Bus+TripGo"
              />
            </div>
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  );
}