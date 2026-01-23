'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthCore';
import { useCart } from '@/context/CartContext';

export const AppNavbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { totalItems } = useCart();

    return (
        <nav className="border-b border-neutral-900 bg-black/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                {/* LOGO */}
                <Link href="/" className="text-xl font-black italic tracking-tighter hover:text-red-600 transition-colors">
                    YAMAGUCHI <span className="text-red-600">PASTAS</span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        <Link href="/products" className="hover:text-white transition-colors">Carta</Link>
                        <Link href="/nosotros" className="hover:text-white transition-colors">Nuestro Dojo</Link>
                    </div>

                    <div className="flex items-center gap-5 border-l border-neutral-800 pl-8">
                        <Link href="/cart" className="relative group p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>

                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden sm:block">
                                    Konchiwa, {user?.firstName || user?.first_name || user?.name || 'Guerrero'}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
