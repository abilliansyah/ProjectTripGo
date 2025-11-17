import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}