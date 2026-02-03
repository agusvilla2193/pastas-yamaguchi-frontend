'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const { api } = useAuth();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            toast.success(response.data.message);
        } catch (error) {
            toast.error('Ocurrió un error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-neutral-950 border border-neutral-900 p-10 rounded-[2.5rem] shadow-2xl">
                <h2 className="text-3xl font-black italic uppercase text-center mb-2">Recuperar <span className="text-red-600">Acceso</span></h2>
                <p className="text-neutral-500 text-center text-sm mb-8">Te enviaremos un código para restablecer tu disciplina.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">Email del Guerrero</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-neutral-900 border-none rounded-2xl py-4 px-6 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-red-600 transition-all"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <button
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-all">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
