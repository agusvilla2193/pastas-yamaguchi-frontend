'use client';

import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Helpers para hidratación segura
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SuccessPage() {
    const { clearCart } = useCart();
    const hasCleared = useRef(false);

    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        if (isClient && !hasCleared.current) {
            // Limpiamos el carrito local después de un pago exitoso
            clearCart();
            hasCleared.current = true;
        }
    }, [isClient, clearCart]);

    if (!isClient) return null;

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 bg-neutral-950">
            <div className="max-w-md w-full text-center animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000 ease-out">

                <div className="relative inline-block mb-10">
                    <div className="absolute inset-0 bg-red-600 blur-[40px] opacity-30 animate-pulse"></div>
                    <div className="relative border-2 border-red-600 w-28 h-28 rounded-full flex items-center justify-center mx-auto bg-neutral-950 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                        <span className="text-red-600 text-5xl font-black italic select-none">✓</span>
                    </div>
                </div>

                <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-4">Misión Cumplida</p>

                <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white mb-6 leading-[0.9]">
                    ¡GRACIAS POR <span className="text-red-600 block text-7xl mt-1">TU COMPRA!</span>
                </h1>

                <p className="text-neutral-500 text-sm leading-relaxed mb-12 italic font-medium max-w-[280px] mx-auto">
                    El Sensei ya recibió tu orden y está seleccionando las mejores materias primas. Recibirás un correo con los detalles.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/orders"
                        className="bg-white text-black font-black uppercase italic py-5 rounded-full hover:bg-red-600 hover:text-white transition-all duration-500 tracking-tighter text-sm shadow-[0_10px_40px_rgba(0,0,0,0.5)] active:scale-95 text-center"
                    >
                        Ver mis pedidos
                    </Link>

                    <Link
                        href="/products"
                        className="text-neutral-600 font-black uppercase italic text-[10px] tracking-[0.3em] hover:text-white transition-colors py-4 text-center"
                    >
                        Volver a la carta
                    </Link>
                </div>

                <div className="mt-16 flex items-center justify-center gap-2 opacity-20">
                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                    <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                    <div className="w-1 h-1 bg-neutral-600 rounded-full" />
                </div>
            </div>
        </div>
    );
}
