'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthCore';

export const AppNavbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md text-white">
            <div className="container mx-auto flex justify-between items-center">

                {/* Logo / Inicio */}
                <Link href="/" className="text-xl font-bold hover:text-gray-300">
                    Pastas Yamaguchi
                </Link>

                {/* Enlaces */}
                <div className="flex items-center space-x-6">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/products"
                                className={`${pathname === '/products' ? 'border-b-2 border-white' : 'hover:text-gray-300'}`}
                            >
                                Productos
                            </Link>
                            <span className="text-gray-400 text-sm">
                                Hola, <span className="text-white font-medium">{user?.firstName || 'Usuario'}</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className={`${pathname === '/login' ? 'border-b-2 border-white' : 'hover:text-gray-300'}`}
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
