// app/admin/page.tsx (Hanya untuk Admin)

import { AuthGuard } from '@/components/AuthGuard';

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={['admin']}>
      <h1>Halaman Admin Khusus</h1>
      <p>Ini hanya dapat dilihat oleh pengguna dengan role 'admin'.</p>
    </AuthGuard>
  );
}