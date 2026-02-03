import React from 'react';
import Link from 'next/link';
import { User } from '@/types/auth';

interface UserActionsProps {
    user: User | null;
    logout: () => void;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, logout }) => (
    <div className="flex items-center gap-8 animate-in fade-in duration-500">
        <Link
            href="/orders"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Mis Pedidos
        </Link>

        {/* --- NUEVO LINK AL PERFIL --- */}
        <Link
            href="/profile"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mi Perfil
        </Link>

        <div className="flex items-center gap-4 border-l border-neutral-800 pl-4">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest hidden lg:block">
                Konchiwa, <span className="text-white">{user?.firstName}</span>
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
