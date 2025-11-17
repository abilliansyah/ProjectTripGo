/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Mencakup semua file di folder app
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Mencakup semua file di folder pages
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Mencakup semua file di folder components (tempat RegisterForm Anda berada)
  ],
  theme: {
    extend: {
      // Tambahkan warna kustom TripGo Anda di sini jika diperlukan, contoh:
      colors: {
        'tripgo-blue': '#294B69', 
      },
    },
  },
  plugins: [],
}