'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthCore';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { User } from '@/types/auth';

export const AppNavbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const { totalItems } = useCart();
    const pathname = usePathname();

    // Si es admin, no mostramos el navbar principal
    if (pathname.startsWith('/admin')) return null;

    // Detectamos si estamos en el cliente de forma segura para el linter
    const isClient = typeof window !== 'undefined';

    return (
        <nav className="border-b border-neutral-900 bg-black/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">

                <Logo />

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 items-center">
                        <Link href="/products" className="hover:text-white transition-colors">Carta</Link>
                        <Link href="/nosotros" className="hover:text-white transition-colors">Nuestro Dojo</Link>

                        {/* Solo renderizamos si es cliente y es admin */}
                        {isClient && user?.role === 'admin' && <AdminLink />}
                    </div>

                    <div className="flex items-center gap-5 border-l border-neutral-800 pl-8">
                        <CartBadge count={totalItems} />

                        {/* Si no estamos en el cliente, mostramos un espacio vacío 
                           para que el HTML inicial sea ligero y no cause errores de hidratación.
                        */}
                        {!isClient ? (
                            <div className="w-20" />
                        ) : isAuthenticated ? (
                            <UserActions user={user} logout={logout} />
                        ) : (
                            <Link href="/login" className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300">
                                Entrar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// --- SUB-COMPONENTES CON TIPADO CORRECTO ---

const Logo = () => (
    <Link href="/" className="group text-xl font-black italic tracking-tighter transition-all duration-300">
        <span className="text-white group-hover:text-red-600">YAMAGUCHI</span>
        <span className="text-red-600 group-hover:text-white ml-1">PASTAS</span>
    </Link>
);

const AdminLink = () => (
    <Link
        href="/admin/orders"
        className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-5 py-2.5 rounded-full border border-red-600/30 text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group"
    >
        <span className="w-1.5 h-1.5 bg-red-600 group-hover:bg-white rounded-full animate-pulse" />
        Dashboard Admin
    </Link>
);

const CartBadge = ({ count }: { count: number }) => (
    <Link href="/cart" className="relative group p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {count}
            </span>
        )}
    </Link>
);

// Cambié "any" por "User | null" para que el linter esté feliz
const UserActions = ({ user, logout }: { user: User | null; logout: () => void }) => (
    <div className="flex items-center gap-6">
        <Link
            href="/orders"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Mis Pedidos
        </Link>
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden lg:block">
                Konchiwa, {user?.firstName || user?.name || 'Guerrero'}
            </span>
            <button
                onClick={logout}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
            >
                Salir
            </button>
        </div>
    </div>
);
