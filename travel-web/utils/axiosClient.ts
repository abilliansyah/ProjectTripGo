import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://projecttripgo-production-1bec.up.railway.app/api', // pastikan ada /api jika prefix di laravel
  withCredentials: true, // WAJIB TRUE
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
});

export default axiosClient;