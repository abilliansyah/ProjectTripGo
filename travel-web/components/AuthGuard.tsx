// components/AuthGuard.tsx
"use client";

import { useAuth } from '@/hooks/UseAuth';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Array<'user' | 'admin'>; // Optional, untuk membatasi akses role
}

export const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return <div>Memuat sesi...</div>;
    }

    if (!isAuthenticated) {
        // Jika belum login, redirect ke halaman login
        router.push('/login'); 
        return null; 
    }
    
    // Logika pembatasan Role
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized'); // Redirect ke halaman akses ditolak
        return <div>Akses Ditolak.</div>;
    }

    // Jika terautentikasi dan memiliki role yang diizinkan, tampilkan konten
    return <>{children}</>;
};
