// utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://projecttripgo-production.up.railway.app', // ganti dengan URL backend kamu
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export default axiosInstance;
