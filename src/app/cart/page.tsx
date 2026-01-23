'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import axios from 'axios';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { isAuthenticated, api } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para finalizar tu pedido');
            router.push('/login');
            return;
        }

        // Evitamos múltiples ejecuciones si el usuario hace click rápido
        if (isLoading) return;

        setIsLoading(true);

        try {
            // 1. Limpiamos el carrito en el Backend para empezar de cero
            await api.delete('/cart/clear');

            // 2. Sincronizamos los items actuales del LocalStorage al Backend
            await Promise.all(
                cart.map((item) =>
                    api.post('/cart/add', {
                        productId: item.id,
                        quantity: item.quantity
                    })
                )
            );

            // 3. Creamos la orden definitiva
            const response = await api.post('/orders');

            if (response.status === 201) {
                toast.success('¡Honor y Pasta!', {
                    description: 'Tu pedido ha sido recibido en el Dojo.'
                });

                // 4. Limpiamos LocalStorage y redirigimos al historial
                clearCart();
                router.push('/orders');
            }
        } catch (error: unknown) {
            console.error("Error en el proceso de compra:", error);
            let msg = 'No pudimos procesar tu pedido';
            if (axios.isAxiosError(error)) {
                // Si el backend envió un error específico, lo mostramos
                msg = error.response?.data?.message || msg;
            }
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-black uppercase italic mb-2">Tu carrito está vacío</h1>
                <p className="text-neutral-500 text-sm mb-8 italic">El honor exige que elijas al menos una pasta.</p>
                <Link href="/products" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                    Volver a la carta
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <h1 className="text-4xl font-black uppercase italic mb-12 tracking-tighter">
                Tu <span className="text-red-600">Pedido</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-neutral-950 p-6 rounded-[2rem] border border-neutral-900 shadow-xl">
                            <div className="relative h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-800">
                                <Image
                                    src={item.image || 'https://via.placeholder.com/150'}
                                    alt={item.name}
                                    fill
                                    sizes="96px"
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="font-bold text-lg uppercase tracking-tight">{item.name}</h3>
                                <p className="text-neutral-500 text-xs mb-2 italic">{item.category}</p>
                                <p className="text-red-600 font-black text-sm">${item.price}</p>
                            </div>

                            <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-neutral-800">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded-lg transition-colors font-bold"
                                >
                                    -
                                </button>
                                <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded-lg transition-colors font-bold"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-3 text-neutral-600 hover:text-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button onClick={clearCart} className="text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors pl-2">
                        Vaciar carrito completo
                    </button>
                </div>

                {/* RESUMEN */}
                <div className="bg-neutral-950 p-8 rounded-[2.5rem] border border-neutral-900 h-fit lg:sticky lg:top-32 shadow-2xl">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-neutral-500">Resumen del Dojo</h2>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="font-bold">${totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Envío</span>
                            <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Gratis</span>
                        </div>
                        <div className="pt-4 border-t border-neutral-900 flex justify-between items-end">
                            <span className="font-black uppercase italic">Total</span>
                            <span className="text-3xl font-black text-red-600 leading-none">${totalPrice.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                Procesando...
                            </span>
                        ) : (
                            isAuthenticated ? 'Confirmar Pedido' : 'Entrar para Comprar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
