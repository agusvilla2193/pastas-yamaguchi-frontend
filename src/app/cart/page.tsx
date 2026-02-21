'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthCore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import axios from 'axios';

// --- INTERFACES ---
interface CartItemData {
    id: number;
    name: string;
    price: number | string;
    quantity: number;
    image?: string;
    category?: string;
}

interface CartItemProps {
    item: CartItemData;
    onUpdate: (id: number, quantity: number) => void;
    onRemove: (id: number) => void;
}

interface OrderSummaryProps {
    totalPrice: number;
    isLoading: boolean;
    isAuthenticated: boolean;
    onCheckout: () => Promise<void>;
}

// Helpers para hidratación segura
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();
    const { isAuthenticated, api } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para finalizar tu pedido');
            router.push('/login');
            return;
        }

        if (cart.length === 0) return;
        setIsLoading(true);

        try {
            // 1. Sincronizamos el carrito con el backend
            // Es buena práctica limpiar y re-subir para asegurar consistencia
            await api.delete('/cart/clear');
            await Promise.all(
                cart.map((item) =>
                    api.post('/cart/add', {
                        productId: item.id,
                        quantity: item.quantity
                    })
                )
            );

            // 2. Creamos la orden y obtenemos el link de Mercado Pago
            const response = await api.post('/orders');

            if (response.status === 201) {
                const { init_point } = response.data;

                if (init_point) {
                    toast.success('Redirigiendo a Mercado Pago...');
                    // Redirección externa obligatoria para pagar
                    window.location.href = init_point;
                } else {
                    toast.success('¡Pedido recibido!');
                    router.push('/checkout/success');
                }
            }
        } catch (error: unknown) {
            let msg = 'No pudimos procesar tu pedido';
            if (axios.isAxiosError(error)) {
                msg = error.response?.data?.message || msg;
            }
            toast.error(msg);
            console.error('Checkout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isClient) return null;
    if (cart.length === 0) return <EmptyCart />;

    return (
        <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-5xl font-black uppercase italic mb-12 tracking-tighter text-white">
                Tu <span className="text-red-600">Pedido</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdate={updateQuantity}
                            onRemove={removeFromCart}
                        />
                    ))}
                    <Link href="/products" className="inline-block text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-red-500 transition-colors pl-2">
                        ← Seguir comprando
                    </Link>
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        totalPrice={totalPrice}
                        isLoading={isLoading}
                        isAuthenticated={isAuthenticated}
                        onCheckout={handleCheckout}
                    />
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTES TIPADOS ---

const EmptyCart = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 border border-neutral-800 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        </div>
        <h1 className="text-2xl font-black uppercase italic mb-2 text-white">Tu carrito está vacío</h1>
        <p className="text-neutral-500 text-sm mb-8 italic">El honor exige que elijas al menos una pasta.</p>
        <Link href="/products" className="bg-red-600 hover:bg-white hover:text-black text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300">
            Volver a la carta
        </Link>
    </div>
);

const CartItem = ({ item, onUpdate, onRemove }: CartItemProps) => (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-neutral-950 p-6 rounded-[2rem] border border-neutral-900 shadow-xl group hover:border-red-600/30 transition-all duration-300">
        <div className="relative h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0 border border-neutral-800">
            <Image
                src={item.image || 'https://via.placeholder.com/150'}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
        </div>

        <div className="flex-grow text-center sm:text-left">
            <h3 className="font-bold text-lg uppercase tracking-tight text-white">{item.name}</h3>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">{item.category}</p>
            <p className="text-red-600 font-black text-lg">${Number(item.price).toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 rounded-xl p-1 border border-neutral-800">
            <button onClick={() => onUpdate(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-red-600 text-white rounded-lg transition-colors font-bold">-</button>
            <span className="text-sm font-black w-4 text-center text-white">{item.quantity}</span>
            <button onClick={() => onUpdate(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-red-600 text-white rounded-lg transition-colors font-bold">+</button>
        </div>

        <button onClick={() => onRemove(item.id)} className="p-3 text-neutral-600 hover:text-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
);

const OrderSummary = ({ totalPrice, isLoading, isAuthenticated, onCheckout }: OrderSummaryProps) => (
    <div className="bg-neutral-950 p-8 rounded-[2.5rem] border border-neutral-900 h-fit lg:sticky lg:top-32 shadow-2xl">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-neutral-500">Resumen del Dojo</h2>
        <div className="space-y-4 mb-8">
            <div className="flex justify-between text-sm">
                <span className="text-neutral-500 italic">Subtotal</span>
                <span className="font-bold text-white">${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-neutral-500 italic">Envío</span>
                <span className="text-green-500 font-black uppercase text-[10px] tracking-widest">Gratis</span>
            </div>
            <div className="pt-4 border-t border-neutral-900 flex justify-between items-end">
                <span className="font-black uppercase italic text-white">Total</span>
                <span className="text-3xl font-black text-red-600 leading-none">${totalPrice.toLocaleString()}</span>
            </div>
        </div>

        <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full bg-white hover:bg-red-600 text-black hover:text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Procesando...
                </span>
            ) : (
                isAuthenticated ? 'Pagar con Mercado Pago' : 'Entrar para Comprar'
            )}
        </button>
        <p className="text-[9px] text-neutral-600 text-center mt-4 italic uppercase tracking-tighter">Protegido por el honor del Sensei</p>
    </div>
);
