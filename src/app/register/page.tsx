'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthCore'; // Ruta corregida con @
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';

export default function RegisterPage() {
    const { api, login } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Usamos nuestra instancia modularizada de API
            const response = await api.post('/auth/register', formData);

            toast.success(`¡Bienvenido al Dojo, ${formData.firstName}!`);

            login(response.data.access_token, response.data.user);
            router.push('/products');
        } catch (error: unknown) {
            // Verificamos si es un error de Axios para acceder a la respuesta del servidor
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Error al registrarse';
                toast.error(message);
            } else {
                toast.error('Ocurrió un error inesperado');
            }
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Estilos consistentes con el resto de la app
    const inputStyles = "w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white placeholder:text-neutral-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8 bg-neutral-950 border border-neutral-900 p-10 rounded-[2.5rem] shadow-2xl">

                <div className="text-center">
                    <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px]">Unirse a la familia</span>
                    <h2 className="text-4xl font-black italic tracking-tighter mt-2">CREAR <span className="text-red-600">CUENTA</span></h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Nombre" required
                            className={inputStyles}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                        <input
                            type="text" placeholder="Apellido" required
                            className={inputStyles}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>

                    <input
                        type="email" placeholder="Email" required
                        className={inputStyles}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password" placeholder="Contraseña" required
                        className={inputStyles}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {isLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-neutral-500 text-xs uppercase tracking-widest">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="text-white font-bold hover:text-red-600 transition-colors">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
