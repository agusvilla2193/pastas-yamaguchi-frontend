'use client';

import { AdminGuard } from '@/components/auth/AdminGuard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Órdenes',
        href: '/admin/orders',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        label: 'Productos',
        href: '/admin/products',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        ),
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-black">
                {/* SIDEBAR */}
                <aside className="w-72 bg-neutral-950 border-r border-neutral-900 p-8 flex flex-col shrink-0 sticky top-0 h-screen">
                    <div className="mb-12">
                        <h2 className="text-white font-black text-2xl italic tracking-tighter">
                            ADMIN<span className="text-red-600">PANEL</span>
                        </h2>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">Yamaguchi Dojo</p>
                    </div>

                    <nav className="flex flex-col gap-3">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${active
                                            ? 'bg-red-600 text-white border-red-500 shadow-[0_10px_30px_rgba(220,38,38,0.15)]'
                                            : 'text-neutral-500 border-transparent hover:bg-neutral-900 hover:text-white'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* BOTÓN VOLVER ABAJO */}
                    <div className="mt-auto pt-8 border-t border-neutral-900">
                        <Link href="/" className="flex items-center gap-3 text-neutral-600 hover:text-white transition-colors group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">Volver a la tienda</span>
                        </Link>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 h-screen overflow-y-auto bg-black p-12">
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
