import axios from 'axios';

const axiosClient = axios.create({
  // Gunakan env variable, jika tidak ada baru pakai localhost (untuk dev)
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Penting jika Anda menggunakan Sanctum/Cookies
});

export default axiosClient;