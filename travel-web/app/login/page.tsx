import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'linear-gradient(to right, #ffffff, #f0f4ff)'}}>
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        
        {/* Header Sesuai Desain */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Selamat Datang Kembali!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk untuk memulai perjalananmu bersama TripGo
          </p>
        </div>
        
        {/* Form Login */}
        <LoginForm />
        
        {/* Link Daftar */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            belum punya akun? {' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              daftar disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}