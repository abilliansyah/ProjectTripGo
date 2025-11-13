// app/admin/users/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, User } from '@/lib/AuthContext'; 

// --- Definisi Tipe Data untuk Tabel ---
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Asumsi role juga datang dari API
  created_at: string;
}

// URL dasar API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://projecttripgo-production.up.railway.app';

export default function UserManagementPage() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data dari Laravel
  const fetchUsers = useCallback(async () => {
    if (!user) return; // Jangan fetch jika user belum terautentikasi

    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        setError("Token otentikasi tidak ditemukan. Harap login kembali.");
        setLoading(false);
        logout();
        return;
    }

    try {
      // PANGGILAN API NYATA KE LARAVEL
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Mengirim token otentikasi
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401 || response.status === 403) {
        // Token tidak valid atau tidak memiliki izin
        setError("Akses ditolak. Token tidak valid atau kedaluwarsa.");
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`Gagal mengambil data: ${response.statusText}`);
      }

      const data: UserData[] = await response.json();
      
      // Tambahkan logic untuk memastikan user admin yang sedang login ada di daftar (opsional)
      // Jika Laravel sudah mengembalikan data user admin, bagian ini tidak diperlukan.
      // setUsers(data); 

      // Jika data dari Laravel hanya berupa array UserData[]
      setUsers(data);

    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Terjadi kesalahan saat koneksi ke server: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user, logout]); // Dependensi pada user agar hanya fetch setelah otentikasi

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Fungsi DELETE (memanggil endpoint Laravel)
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('authToken');
    if (!confirm(`Yakin ingin menghapus User ID: ${id}?`)) return;
    if (!token) {
        alert("Token tidak ada, gagal menghapus.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Gagal menghapus user: ${response.statusText}`);
        }

        // Hapus dari state setelah sukses
        setUsers(users.filter(u => u.id !== id));
        alert('User berhasil dihapus!');
    } catch (err) {
        console.error("Error deleting user:", err);
        alert(`Gagal menghapus user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-600">Memuat data pengguna dari API...</div>;
  }

  if (error) {
    return (
        <div className="text-center mt-20 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            <h3 className="font-bold">Error Koneksi Data</h3>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Kelola Akun Pengguna</h2>
      
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 shadow-md">
          + Tambah User Baru
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Daftar</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className={user.role === 'admin' ? 'bg-indigo-50/50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.created_at}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900 transition duration-150">Edit</button> 
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 transition duration-150 disabled:opacity-50"
                    disabled={user.role === 'admin'} 
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}