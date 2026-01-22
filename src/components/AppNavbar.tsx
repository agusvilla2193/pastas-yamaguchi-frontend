'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';

export const AppNavbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const linkBase = "text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300";
    const linkActive = "text-red-600";
    const linkInactive = "text-neutral-400 hover:text-white";

    return (
        <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50 py-4 px-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="group">
                    <span className="text-lg font-black italic tracking-tighter text-white group-hover:text-red-600 transition-colors">
                        YAMAGUCHI <span className="text-red-600 group-hover:text-white">PASTAS</span>
                    </span>
                </Link>

                {/* NAVEGACIÓN */}
                <div className="flex items-center space-x-6">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/products"
                                className={`${linkBase} ${pathname === '/products' ? linkActive : linkInactive}`}
                            >
                                Productos
                            </Link>

                            <div className="h-4 w-[1px] bg-neutral-800 hidden md:block" />

                            <div className="hidden md:block">
                                <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                                    Dojo de <span className="text-white italic">{user?.firstName || 'Chef'}</span>
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="bg-white text-black hover:bg-red-600 hover:text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 active:scale-95"
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4">
                            {/* LINK INGRESAR (Solo texto/borde) */}
                            <Link
                                href="/login"
                                className={`${linkBase} ${pathname === '/login' ? linkActive : linkInactive} px-2`}
                            >
                                Ingresar
                            </Link>

                            {/* BOTÓN REGISTRARSE (Rojo destacado) */}
                            <Link
                                href="/register"
                                className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-lg shadow-red-900/20 active:scale-95"
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
