'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import Link from 'next/link';

function ConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { api } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const confirmAccount = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                return;
            }

            try {
                // Llamo al endpoint que creo en el backend
                await api.get(`/auth/confirm?token=${token}`);
                setStatus('success');
                toast.success('¡Cuenta activada con éxito! Ya puedes comprar.');
            } catch (error) {
                console.error(error);
                setStatus('error');
                toast.error('El token es inválido o ha expirado.');
            }
        };

        confirmAccount();
    }, [searchParams, api]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-neutral-950 border border-neutral-900 p-12 rounded-[2.5rem] text-center shadow-2xl">
                {status === 'loading' && (
                    <div className="space-y-4">
                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">Validando Disciplina...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <span className="text-green-500 text-5xl italic font-black">✓</span>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase">Cuenta <span className="text-red-600">Activada</span></h2>
                        <p className="text-neutral-400 text-sm">Tu email ha sido verificado. Ahora eres parte oficial de Yamaguchi Pastas.</p>
                        <Link
                            href="/login"
                            className="inline-block w-full bg-white text-black font-black py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-[10px]"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <span className="text-red-600 text-5xl italic font-black">!</span>
                        <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">Error de <span className="text-red-600">Activación</span></h2>
                        <p className="text-neutral-400 text-sm">El enlace no es válido o ya ha sido utilizado.</p>
                        <Link
                            href="/register"
                            className="inline-block w-full border border-neutral-800 text-white font-black py-4 rounded-xl hover:bg-neutral-900 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Volver a intentar
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// Next.js requiere Suspense para usar useSearchParams en componentes 'use client'
export default function ConfirmPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ConfirmContent />
        </Suspense>
    );
}
