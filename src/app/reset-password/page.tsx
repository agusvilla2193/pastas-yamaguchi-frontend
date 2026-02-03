'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import Link from 'next/link';
import axios from 'axios';

// Defino la estructura del error que espero del backend
interface BackendError {
    message: string | string[];
    error: string;
    statusCode: number;
}

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { api } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: password,
            });

            toast.success('¡Contraseña actualizada! Ya puedes iniciar sesión.');
            router.push('/login');
        } catch (error: unknown) {
            if (axios.isAxiosError<BackendError>(error)) {
                const serverMessage = error.response?.data?.message;

                if (Array.isArray(serverMessage)) {
                    serverMessage.forEach(msg => toast.error(msg));
                } else {
                    toast.error(serverMessage || 'El enlace ha expirado o es inválido');
                }
            } else {
                toast.error('Ocurrió un error inesperado al restablecer la contraseña');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center bg-neutral-950 p-10 rounded-3xl border border-neutral-900">
                    <p className="text-red-600 font-black uppercase italic mb-4 tracking-widest">Token Inexistente</p>
                    <p className="text-neutral-500 text-xs mb-6">El enlace de recuperación es necesario.</p>
                    <Link href="/login" className="text-white bg-neutral-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-neutral-950 border border-neutral-900 p-10 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-3xl font-black italic uppercase text-center mb-2">Nueva <span className="text-red-600">Contraseña</span></h2>
                <p className="text-neutral-500 text-center text-sm mb-8">Establece tu nueva credencial de acceso al Dojo.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">Nueva Clave</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-neutral-900 border-none rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-red-600 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">Repetir Clave</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-neutral-900 border-none rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-red-600 transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl mt-4 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-neutral-500 text-center mt-20 animate-pulse">CARGANDO DOJO...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
