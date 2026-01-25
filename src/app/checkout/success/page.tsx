'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function SuccessPage() {
    const { clearCart } = useCart();
    const hasCleared = useRef(false); // Referencia para evitar el bucle

    useEffect(() => {
        // Solo ejecuta la limpieza si no se hizo antes en esta sesión de carga
        if (!hasCleared.current) {
            clearCart();
            hasCleared.current = true;
        }
    }, [clearCart]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 bg-neutral-950 animate-in fade-in duration-700">
            <div className="max-w-md w-full text-center">

                <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-red-600 blur-3xl opacity-20 animate-pulse"></div>
                    <div className="relative border-2 border-red-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto bg-neutral-950">
                        <span className="text-red-600 text-4xl font-black italic">✓</span>
                    </div>
                </div>

                <p className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Misión Cumplida</p>

                <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white mb-6 leading-none">
                    ¡GRACIAS POR <span className="text-red-600 block text-7xl">TU COMPRA!</span>
                </h1>

                <p className="text-neutral-400 text-sm leading-relaxed mb-12 italic font-medium">
                    El Sensei ya recibió tu orden y está seleccionando las mejores materias primas.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/orders"
                        className="bg-white text-black font-black uppercase italic py-5 rounded-full hover:bg-red-600 hover:text-white transition-all tracking-tighter text-sm shadow-xl"
                    >
                        Ver mis pedidos
                    </Link>

                    <Link
                        href="/products"
                        className="text-neutral-600 font-black uppercase italic text-[10px] tracking-[0.2em] hover:text-white transition-colors py-2"
                    >
                        Volver a la carta
                    </Link>
                </div>
            </div>
        </div>
    );
}
