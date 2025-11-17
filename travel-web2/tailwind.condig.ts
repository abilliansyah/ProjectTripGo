
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Mencakup semua di folder app/
    './components/**/*.{js,ts,jsx,tsx,mdx}', // Mencakup semua komponen
    ],
  theme: {
    extend: {
      // Anda bisa menambahkan kustomisasi theme di sini
    },
  },
  plugins: [],
};

export default config;