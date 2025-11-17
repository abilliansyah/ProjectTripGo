import Link from 'next/link';

export default function AuthHeader() {
  return (
    <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            {/* Logo TripGo */}
            <Link href="/" className="flex items-center space-x-1">
                <span className="font-extrabold text-xl text-blue-800 tracking-tight" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>TripGo</span>
                <span className="text-xs text-gray-500 font-medium">Pusat Wisata Travel</span>
            </Link>
            
            {/* Navigasi Utama */}
            <nav className="hidden md:flex space-x-6 text-gray-600 font-medium">
                <Link href="#" className="hover:text-blue-600 transition duration-150">Beranda</Link>
                <Link href="#" className="hover:text-blue-600 transition duration-150">Reservasi</Link>
                <Link href="#" className="hover:text-blue-600 transition duration-150">Cara Pembayaran</Link>
                <Link href="#" className="hover:text-blue-600 transition duration-150">Outlet</Link>
                <Link href="#" className="hover:text-blue-600 transition duration-150">Kontak</Link>
            </nav>
            
            {/* Tombol Daftar/Masuk - Mengarahkan ke Login/Register */}
            <Link 
                href="/auth/login" 
                className="bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
                Daftar/Masuk
            </Link>
        </div>
    </header>
  );
}