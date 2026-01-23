'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/auth/AuthGuard';

interface OrderItem {
    id: number;
    quantity: number;
    priceAtPurchase: string;
    product: {
        name: string;
    };
}

interface Order {
    id: number;
    orderDate: string;
    status: string;
    total: string;
    items: OrderItem[];
}

export default function MyOrdersPage() {
    const { api, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("No pudimos cargar tus pedidos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <div className="max-w-5xl mx-auto px-6 py-20 min-h-screen">
                <h1 className="text-4xl font-black uppercase italic mb-12 tracking-tighter">
                    Mis <span className="text-red-600">Pedidos</span>
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center py-20">
                        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="uppercase font-black italic text-xs tracking-widest text-neutral-500">
                            Consultando registros...
                        </p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-neutral-900/30 border border-neutral-900 rounded-[2rem] p-12 text-center">
                        <p className="text-neutral-500 italic mb-6">Aún no has realizado ningún pedido en el Dojo.</p>
                        <a href="/products" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-white transition-colors">
                            Ir a la carta →
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-neutral-950 border border-neutral-900 rounded-[2.5rem] p-8 shadow-xl hover:border-neutral-700 transition-all">
                                <div className="flex flex-col md:flex-row justify-between mb-6 border-b border-neutral-900 pb-6 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-1">Orden #{order.id}</p>
                                        <p className="text-xl font-bold italic">
                                            {new Date(order.orderDate).toLocaleDateString('es-AR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:items-end justify-center">
                                        <span className="bg-green-900/20 text-green-500 text-[10px] font-black uppercase px-4 py-1.5 rounded-full border border-green-900/30 w-fit">
                                            {order.status}
                                        </span>
                                        <p className="text-3xl font-black mt-2 text-white tracking-tighter">${order.total}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Detalle de pastas</p>
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm group">
                                            <span className="text-neutral-400">
                                                <span className="text-white font-bold group-hover:text-red-600 transition-colors">{item.quantity}x</span> {item.product.name}
                                            </span>
                                            <span className="font-mono text-neutral-500 text-xs">
                                                ${parseFloat(item.priceAtPurchase).toLocaleString()} c/u
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
