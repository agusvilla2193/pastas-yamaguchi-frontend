'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';
import Link from 'next/link';
import { Input } from '@/components/ui/FormElements';
import { useLoginForm } from '@/hooks/useLoginForm';

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const LoginPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const redirectPath = searchParams.get('redirect') || '/products';

    // Usamos nuestro nuevo hook modularizado
    const { email, setEmail, password, setPassword, isLoading, handleSubmit } = useLoginForm(redirectPath);

    useEffect(() => {
        if (isClient && isAuthenticated) {
            router.push(redirectPath);
        }
    }, [isClient, isAuthenticated, router, redirectPath]);

    if (!isClient || isAuthenticated) return null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8 bg-neutral-950 border border-neutral-800/50 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px]">Acceso al Dojo</span>
                    <h2 className="text-4xl font-black italic tracking-tighter mt-2 text-white uppercase">
                        Iniciar <span className="text-red-600">Sesión</span>
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Contraseña</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="flex justify-end pr-2">
                            <Link
                                href="/forgot-password"
                                className="text-[9px] text-neutral-600 hover:text-red-600 transition-colors uppercase font-bold tracking-tighter"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px] disabled:opacity-50 active:scale-95 shadow-xl"
                    >
                        {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
                    </button>
                </form>

                <div className="text-center pt-6 border-t border-neutral-900 space-y-2">
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                        ¿No tienes cuenta?{' '}
                        <Link href={`/register?redirect=${redirectPath}`} className="text-white hover:text-red-600 transition-colors ml-1">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">
        {children}
    </label>
);

export default LoginPage;
