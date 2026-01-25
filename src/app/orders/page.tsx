'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Link from 'next/link';

// --- INTERFACES ---
interface OrderItem {
    id: number;
    quantity: number;
    priceAtPurchase: string;
    product: { name: string; };
}

interface Order {
    id: number;
    orderDate: string;
    status: string;
    total: string;
    items: OrderItem[];
}

// --- CONFIGURACIÓN DE ESTADOS ---
const statusConfig: Record<string, { label: string; color: string; step: number }> = {
    'PAID': { label: 'Confirmado', color: 'text-green-500', step: 1 },
    'PREPARING': { label: 'En Cocina', color: 'text-yellow-500', step: 2 },
    'SHIPPED': { label: 'En Camino', color: 'text-blue-500', step: 3 },
    'DELIVERED': { label: 'Entregado', color: 'text-neutral-400', step: 4 },
    'CANCELLED': { label: 'Cancelado', color: 'text-red-600', step: 0 }
};

// Helpers para hidratación segura
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function MyOrdersPage() {
    const { api, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Evitamos problemas de hidratación
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (error) {
                toast.error("Error al cargar tus pedidos");
            } finally {
                setLoading(false);
            }
        };

        if (isClient && isAuthenticated) {
            fetchOrders();
        }
    }, [isClient, isAuthenticated, api]);

    if (!isClient) return null;

    return (
        <AuthGuard>
            <div className="max-w-4xl mx-auto px-6 py-24 min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <header className="mb-16">
                    <p className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Historial de Combate</p>
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter text-white">
                        Mis <span className="text-red-600">Pedidos</span>
                    </h1>
                </header>

                {loading ? (
                    <LoadingState />
                ) : orders.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-12">
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}

// --- SUB-COMPONENTES ---

const LoadingState = () => (
    <div className="flex flex-col items-center py-20 animate-pulse">
        <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-neutral-500 uppercase font-black text-[10px] tracking-widest">Consultando el pergamino...</p>
    </div>
);

const EmptyState = () => (
    <div className="bg-neutral-900/20 border border-neutral-900 rounded-[3rem] p-16 text-center backdrop-blur-sm">
        <p className="text-neutral-500 italic mb-8 text-lg">Aún no has desafiado a nuestro Sensei con un pedido.</p>
        <Link href="/products" className="bg-white text-black px-10 py-4 rounded-full font-black uppercase italic hover:bg-red-600 hover:text-white transition-all inline-block shadow-2xl active:scale-95">
            Explorar la Carta →
        </Link>
    </div>
);

const OrderCard = ({ order }: { order: Order }) => {
    const currentStatus = statusConfig[order.status] || { label: order.status, color: 'text-white', step: 1 };

    return (
        <div className="relative group">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-red-600/20 group-hover:bg-red-600 transition-colors rounded-full" />
            <div className="bg-neutral-950/50 border border-neutral-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-md">

                {/* Header de la Card */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-red-600 font-black text-xs uppercase tracking-widest">Orden #{order.id}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                            <span className="text-neutral-500 font-mono text-xs">
                                {new Date(order.orderDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                        <h2 className={`text-3xl font-black uppercase italic tracking-tighter ${currentStatus.color}`}>
                            {currentStatus.label}
                        </h2>
                    </div>
                    <div className="text-left md:text-right">
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Total del Honor</p>
                        <p className="text-4xl font-black text-white italic tracking-tighter">${Number(order.total).toLocaleString()}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                {order.status !== 'CANCELLED' && (
                    <div className="relative flex justify-between mb-12 px-2">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-900 -translate-y-1/2 z-0" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-red-600 -translate-y-1/2 z-0 transition-all duration-1000"
                            style={{ width: `${((currentStatus.step - 1) / 3) * 100}%` }}
                        />
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-500 ${s <= currentStatus.step ? 'bg-red-600 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-neutral-950 border-neutral-800'
                                }`} />
                        ))}
                    </div>
                )}

                {/* Items List */}
                <div className="space-y-4 bg-neutral-900/30 rounded-3xl p-6 border border-neutral-900/50">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center group/item">
                            <div className="flex items-center gap-4">
                                <span className="text-red-600 font-black text-sm italic w-8">{item.quantity}x</span>
                                <span className="text-neutral-300 font-bold uppercase text-sm tracking-tight group-hover/item:text-white transition-colors">{item.product.name}</span>
                            </div>
                            <span className="text-neutral-600 font-mono text-xs">${Number(item.priceAtPurchase).toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
