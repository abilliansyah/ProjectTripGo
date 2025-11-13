
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // Ini PENTING, memberitahu Tailwind di mana mencari class yang digunakan
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Anda bisa menambahkan kustomisasi theme di sini
    },
  },
  plugins: [],
};

export default config;