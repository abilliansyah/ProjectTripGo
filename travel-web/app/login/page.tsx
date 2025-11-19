import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

        <h1 className="text-2xl font-bold text-center">
          Selamat Datang Kembali!
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Masuk untuk memulai perjalananmu bersama TripGo
        </p>

        <LoginForm />

        <p className="text-center mt-4 text-sm text-gray-600">
          belum punya akun?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            daftar disini
          </a>
        </p>
      </div>
    </div>
  );
}
