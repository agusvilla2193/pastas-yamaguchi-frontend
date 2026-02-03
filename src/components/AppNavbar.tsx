'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthCore';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { Logo } from './navbar/Logo';
import { AdminLink } from './navbar/AdminLink';
import { CartBadge } from './navbar/CartBadge';
import { UserActions } from './navbar/UserActions';

export const AppNavbar: React.FC = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { totalItems } = useCart();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (pathname.startsWith('/admin')) return null;

    return (
        <nav className="border-b border-neutral-900 bg-black/80 backdrop-blur-xl sticky top-0 z-50 px-8 py-5 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Logo />

                <div className="flex items-center gap-12">
                    <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 items-center">
                        <Link href="/products" className="hover:text-red-600 transition-colors">Carta</Link>
                        <Link href="/nosotros" className="hover:text-red-600 transition-colors">Nuestro Dojo</Link>

                        {mounted && user?.role === 'admin' && <AdminLink />}
                    </div>

                    <div className="flex items-center gap-8 border-l border-neutral-800 pl-10">
                        <CartBadge count={totalItems} isAuthenticated={isAuthenticated} />

                        {!mounted ? (
                            <div className="w-20 h-9" />
                        ) : isAuthenticated ? (
                            <UserActions user={user} logout={logout} />
                        ) : (
                            <Link
                                href={`/login?redirect=${pathname}`}
                                className="bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-500 shadow-lg shadow-white/5"
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
