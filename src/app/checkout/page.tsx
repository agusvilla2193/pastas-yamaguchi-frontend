'use client';

import React, { useEffect, useState } from 'react';
import { useCheckout } from '@/hooks/useCheckout';
import Link from 'next/link';

export default function CheckoutPage() {
    const { user, cart, totalPrice, isSubmitting, handlePlaceOrder } = useCheckout();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Usamos requestAnimationFrame para sacar el setState del flujo 
        // síncrono del efecto y evitar el error de ESLint
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    // Mientras no esté montado en el cliente, no renderizamos nada
    // para evitar errores de hidratación con LocalStorage
    if (!mounted) return null;

    // Si el carrito está vacío después de cargar
    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">Tu bolsa está vacía</p>
                <Link
                    href="/products"
                    className="bg-white text-black px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
                >
                    Explorar la Carta
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Columna Izquierda: Resumen y Datos */}
            <div className="lg:col-span-2 space-y-8">
                <header>
                    <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">
                        Finalizar <span className="text-red-600">Pedido</span>
                    </h2>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">Revisa tu entrega y selección</p>
                </header>

                {/* Datos de Entrega */}
                <section className="bg-neutral-950 border border-neutral-900 p-8 rounded-[2.5rem] shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white italic border-l-2 border-red-600 pl-4">Punto de Entrega</h3>
                        <Link href="/profile" className="text-[9px] text-neutral-500 hover:text-red-500 transition-colors font-black uppercase tracking-widest">
                            Cambiar Datos
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-neutral-700 uppercase font-black tracking-[0.2em]">Dirección de envío</span>
                            <span className="text-white text-sm font-bold uppercase tracking-tight">{user?.address || 'No especificada'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] text-neutral-700 uppercase font-black tracking-[0.2em]">Contacto directo</span>
                            <span className="text-white text-sm font-bold uppercase tracking-tight">{user?.phone || 'Sin teléfono'}</span>
                        </div>
                    </div>
                </section>

                {/* Lista de Items */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 ml-4 mb-6">Detalle de Productos</h3>
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-neutral-900/20 p-6 rounded-2xl border border-neutral-900/50 hover:border-neutral-800 transition-colors group">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white font-black text-sm uppercase italic tracking-tight group-hover:text-red-500 transition-colors">{item.name}</span>
                                    <span className="text-neutral-600 text-[9px] uppercase font-black tracking-widest">Unidades: {item.quantity}</span>
                                </div>
                                <span className="text-white font-black text-sm tracking-tighter">
                                    ${(Number(item.price) * item.quantity).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Columna Derecha: Pago y Confirmación */}
            <div className="lg:col-span-1">
                <div className="bg-white p-10 rounded-[2.5rem] sticky top-32 shadow-2xl shadow-red-600/5">
                    <h3 className="text-black font-black uppercase tracking-[0.2em] text-[10px] mb-10 italic opacity-50 text-center">Resumen de Pago</h3>

                    <div className="space-y-5 mb-10">
                        <div className="flex justify-between text-neutral-400 text-[9px] font-black uppercase tracking-widest">
                            <span>Subtotal Bruto</span>
                            <span className="text-black">${totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400 text-[9px] font-black uppercase tracking-widest">
                            <span>Costo de Envío</span>
                            <span className="text-green-600 font-bold">Gratuito</span>
                        </div>
                        <div className="h-px bg-neutral-100 my-6" />
                        <div className="flex justify-between items-end text-black font-black uppercase tracking-tighter">
                            <span className="text-xs mb-1 italic opacity-50">Total Final</span>
                            <span className="text-4xl italic leading-none">${totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="w-full bg-red-600 hover:bg-black text-white py-6 rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] transition-all duration-500 shadow-xl shadow-red-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>

                    <div className="mt-8 pt-8 border-t border-neutral-50">
                        <p className="text-[8px] text-neutral-400 text-center uppercase leading-relaxed tracking-widest font-bold">
                            Pago contra entrega <br />
                            <span className="text-neutral-300">Efectivo o Transferencia</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
