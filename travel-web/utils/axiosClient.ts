// utils/axiosClient.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosClient = axios.create({
  baseURL: '/',
  // PENTING: Mengaktifkan pengiriman cookies (credentials)
  withCredentials: true, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default axiosClient;