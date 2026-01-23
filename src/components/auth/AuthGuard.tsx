'use client';

import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Si terminó de cargar y no está autenticado, al login
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // Mientras verifica, mostramos un estado de carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <p className="text-white font-black italic animate-pulse uppercase tracking-widest">
                    Verificando Credenciales...
                </p>
            </div>
        );
    }

    // Si está autenticado, renderiza la página
    return isAuthenticated ? <>{children}</> : null;
};
