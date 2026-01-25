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
                <h1 className="text-4xl font-black uppercase italic mb-12 tracking-tighter text-white">
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
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-neutral-950 border border-neutral-900 rounded-[2rem] p-8 hover:border-red-600/30 transition-all group">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Orden #{order.id}</p>
                                        <p className="text-sm text-neutral-500 font-mono">
                                            {new Date(order.orderDate).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-white">${order.total}</p>
                                        <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-green-900/20 text-green-500 border border-green-900/50">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-900">
                                    <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-4">Detalle del pedido</p>
                                    <ul className="space-y-3">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="flex justify-between text-sm">
                                                <span className="text-neutral-400">
                                                    <span className="text-white font-bold">{item.quantity}x</span> {item.product.name}
                                                </span>
                                                <span className="font-mono text-neutral-500">${item.priceAtPurchase} c/u</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
