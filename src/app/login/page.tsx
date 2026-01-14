'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthCore';

// Define la estructura de la respuesta de la API de Login (asumo que viene de NestJS)
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
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hooks del Contexto y Router
    const { isAuthenticated, login, api } = useAuth();
    const router = useRouter();

    // Redirección si ya está autenticado (protección de ruta)
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/products'); // Redirige a la página de productos si ya inició sesión
        }
    }, [isAuthenticated, router]);

    // Función de envío (handleSubmit)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar errores anteriores
        setIsLoading(true);

        try {
            // Llama a la API de login de tu NestJS
            // NOTA: Asumo que la ruta de login es POST /auth/login
            const response = await api.post<LoginResponse>('/auth/login', {
                email,
                password,
            });

            const { access_token, user } = response.data;

            // 1. Llama a la función de contexto para guardar el token y el usuario
            login(access_token, user);

            // 2. Redirigir a la página de productos
            router.push('/products');

        } catch (err) {
            console.error('Error de login:', err);
            // Manejo de errores de NestJS (ej: 401 Unauthorized)
            setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    // Si ya está autenticado, no muestra el formulario (la redirección se encargará)
    if (isAuthenticated) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-xl text-gray-700">Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>

                {/* Mensaje de Error (Tailwind) */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                            placeholder="tucorreo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 disabled:bg-indigo-400"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Cargando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

<div className="mt-4 text-center">
    <p className="text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Regístrate aquí
        </a>
    </p>
</div>

export default LoginPage;
