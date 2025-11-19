import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-orange-50 px-4">
      
      <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-fadeIn">

        <div className="text-center">
          <h2 className="text-3xl font-bold">Selamat Datang Kembali!</h2>
          <p className="mt-1 text-gray-600">
            Masuk untuk memulai perjalananmu bersama TripGo
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm mt-5 text-gray-600">
          belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            daftar disini
          </Link>
        </p>
      </div>
    </div>
  );
}
