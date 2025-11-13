// app/admin/users/page.tsx

'use client';

import { useState, useEffect } from 'react';
// Pastikan path ke AuthContext Anda benar
import { useAuth, User } from '@/lib/AuthContext'; 
// Asumsi 'User' dari AuthContext sekarang memiliki properti 'email'

// --- Definisi Tipe Data untuk Tabel ---
// Tipe ini harus sesuai dengan data yang dikembalikan oleh Laravel API Anda
interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

// --- Data Simulasi (Ganti dengan Panggilan API Nyata ke Laravel) ---
const mockUsers: UserData[] = [
  { id: 2, name: 'Budi Santoso', email: 'budi@example.com', role: 'user', created_at: '2025-10-01' },
  { id: 3, name: 'Siti Aisyah', email: 'siti@example.com', role: 'user', created_at: '2025-10-05' },
];

// --- Fungsi untuk Menggabungkan User Admin ---
// Fungsi ini harus menyertakan semua properti dari UserData
const formatAdminUser = (user: User): UserData => ({
    id: user.id,
    name: user.name,
    email: user.email, // Properti 'email' harus tersedia dari AuthContext
    role: user.role,
    created_at: '2025-01-01', // Data statis untuk simulasi tanggal daftar
});


export default function UserManagementPage() {
  const { user } = useAuth(); // User yang sedang login
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect untuk Fetch Data dari Laravel API
  useEffect(() => {
    // Di sini Anda akan melakukan fetch ke: GET /api/admin/users
    // Jangan lupa menyertakan token otentikasi admin di header!
    
    setLoading(true);

    // --- SIMULASI PANGGILAN API ---
    setTimeout(() => {
      let allUsers: UserData[] = [...mockUsers];

      // Tambahkan user admin yang sedang login ke daftar (jika ada)
      if (user) {
          // Format user admin agar sesuai dengan type UserData sebelum digabung
          const adminUserFormatted = formatAdminUser(user);
          allUsers = [adminUserFormatted, ...mockUsers.filter(u => u.id !== user.id)];
      }

      setUsers(allUsers);
      setLoading(false);
    }, 500); 
    // --- AKHIR SIMULASI ---

  }, [user]); // Dependensi user untuk memastikan update jika user berubah

  // Fungsi-fungsi CRUD (akan memanggil endpoint Laravel: DELETE)
  const handleDelete = (id: number) => {
    if (confirm(`Yakin ingin menghapus User ID: ${id}?`)) {
      // Panggil DELETE /api/admin/users/{id} di sini
      
      // Update state setelah sukses:
      setUsers(users.filter(u => u.id !== id));
      alert('User berhasil dihapus (simulasi)');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg text-gray-600">Memuat data pengguna...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Kelola Akun Pengguna</h2>
      
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150">
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
                    // Jangan biarkan admin menghapus dirinya sendiri
                    disabled={user.role === 'admin' && user.id === (user?.id || -1)} 
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