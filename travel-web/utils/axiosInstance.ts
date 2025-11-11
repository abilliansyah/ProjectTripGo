// utils/axiosInstance.ts (Kode Fix untuk Axios v1.x+)

import axios, { InternalAxiosRequestConfig } from 'axios'; // <-- Ganti AxiosRequestConfig dengan InternalAxiosRequestConfig

const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL, 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor: Otomatis menyertakan token otorisasi
axiosInstance.interceptors.request.use(
  // Terapkan InternalAxiosRequestConfig untuk type config
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    
    // Ambil token dari LocalStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    
    if (token) {
      // Perbaikan: Pastikan headers ada sebelum menambahkan properti
      // Tambahkan 'Authorization' ke headers yang sudah ada di config
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;