'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import { Input } from '@/components/ui/FormElements';

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

// Helpers para hidratación segura
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthenticated, login, api } = useAuth();
    const router = useRouter();

    // Blindaje contra errores de hidratación de Next.js
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Redirección si ya está autenticado
    React.useEffect(() => {
        if (isClient && isAuthenticated) {
            router.push('/products');
        }
    }, [isClient, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
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

    if (!isClient || isAuthenticated) return null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8 bg-neutral-950 border border-neutral-800/50 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500">

                <div className="text-center">
                    <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px]">Acceso al Dojo</span>
                    <h2 className="text-4xl font-black italic tracking-tighter mt-2 text-white">
                        INICIAR <span className="text-red-600">SESIÓN</span>
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

                    <div>
                        <Label>Contraseña</Label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px] disabled:opacity-50 active:scale-95 shadow-xl"
                    >
                        {isLoading ? 'VERIFICANDO...' : 'ENTRAR'}
                    </button>
                </form>

                <div className="text-center pt-6 border-t border-neutral-900">
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

// Sub-componente interno para mantener limpio el form
const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">
        {children}
    </label>
);

export default LoginPage;
