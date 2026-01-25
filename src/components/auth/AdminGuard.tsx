'use client';

import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'admin') {
                toast.error('Acceso denegado: Se requiere nivel Sensei');
                router.push('/'); // Lo mandamos al home si no es admin
            }
        }
    }, [isAuthenticated, user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white font-black italic uppercase tracking-widest">Verificando Autoridad...</p>
                </div>
            </div>
        );
    }

    // Solo renderiza si es admin
    return isAuthenticated && user?.role === 'admin' ? <>{children}</> : null;
};
