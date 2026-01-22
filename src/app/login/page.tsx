'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';

interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthenticated, login, api } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/products');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post<LoginResponse>('/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;
            login(access_token, user);

            toast.success(`¡Hola de nuevo, ${user.firstName}!`);
            router.push('/products');

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const msg = err.response?.status === 401
                    ? 'Credenciales incorrectas'
                    : 'Error al iniciar sesión';
                toast.error(msg);
            } else {
                toast.error('Error de conexión');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isAuthenticated) return null;

    const inputStyles = "w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8 bg-neutral-950 border border-neutral-800/50 p-10 rounded-[2.5rem] shadow-2xl">

                <div className="text-center">
                    <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px]">Acceso al Dojo</span>
                    <h2 className="text-4xl font-black italic tracking-tighter mt-2">INICIAR <span className="text-red-600">SESIÓN</span></h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">
                            Email
                        </label>
                        <input
                            type="email"
                            className={inputStyles}
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className={inputStyles}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-500 uppercase tracking-widest text-xs disabled:opacity-50 active:scale-95 shadow-xl"
                    >
                        {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
                    </button>
                </form>

                <div className="text-center pt-4 border-t border-neutral-900">
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                        ¿No tienes cuenta?{' '}
                        <Link href="/register" className="text-white hover:text-red-600 transition-colors ml-1">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
