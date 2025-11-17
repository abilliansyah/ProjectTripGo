import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'linear-gradient(to right, #f0f4ff, #ffffff)'}}>
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        
        {/* Header Sesuai Desain */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Silakan Buat Akun!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Buat akun TripGo sebelum memulai perjalanan
          </p>
        </div>
        
        {/* Form Register */}
        <RegisterForm />
        
        {/* Link Login */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Sudah punya akun? {' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}