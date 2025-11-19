import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: dekorasi / ilustrasi (boleh diganti gambar/gradient) */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-[380px] h-[420px] rounded-3xl bg-gradient-to-br from-[#f8fafc] to-[#eef6ff] shadow-lg flex items-center justify-center">
            {/* Bisa ganti dengan ilustrasi / screenshot */}
            <div className="text-center p-6">
              <h3 className="text-xl font-bold text-[#15406A] mb-2">Selamat Datang di TripGo</h3>
              <p className="text-sm text-gray-600">
                Kelola perjalanan dan pemesanan dengan mudah. Masuk untuk melanjutkan.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Card Login */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-extrabold text-slate-900">Selamat Datang Kembali!</h2>
              <p className="text-sm text-gray-500 mt-1">Masuk untuk memulai perjalananmu bersama TripGo</p>
            </div>

            <LoginForm />

            <p className="text-center text-sm mt-5 text-gray-600">
              belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 font-medium hover:underline">
                daftar disini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
