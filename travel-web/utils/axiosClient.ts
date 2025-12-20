import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://projecttripgo-production-1bec.up.railway.app/api',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json', // Tambahkan ini agar server tahu kita mengirim JSON
  },
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// TAMBAHKAN INI: Interceptor untuk menangani error response agar tidak "Unexpected JSON"
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika server error (500) atau maintenance, jangan biarkan frontend mencoba parse JSON
    if (error.response && error.response.status >= 500) {
      console.error("Server Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;