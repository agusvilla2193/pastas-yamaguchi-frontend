'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/auth/AuthGuard';

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

// Diccionario de traducción para los estados
const statusTranslations: Record<string, string> = {
    'PAID': 'Pagado',
    'PREPARING': 'En Cocina',
    'SHIPPED': 'En Camino',
    'DELIVERED': 'Entregado',
    'CANCELLED': 'Cancelado'
};

export default function MyOrdersPage() {
    const { api, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) fetchOrders();
    }, [isAuthenticated]);

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

    return (
        <AuthGuard>
            <div className="max-w-5xl mx-auto px-6 py-20 min-h-screen">
                <h1 className="text-4xl font-black uppercase italic mb-12 tracking-tighter text-white">
                    Mis <span className="text-red-600">Pedidos</span>
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center py-20 animate-pulse text-neutral-500 uppercase font-black text-xs tracking-widest">
                        Consultando registros...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-neutral-900/30 border border-neutral-900 rounded-[2rem] p-12 text-center text-neutral-500 italic">
                        Aún no has realizado pedidos. <br /> <a href="/products" className="text-red-600 mt-4 inline-block not-italic font-black uppercase">Ir a la carta →</a>
                    </div>
                ) : (
                    <div className="grid gap-6">
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
                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${order.status === 'PAID' ? 'border-green-900/50 bg-green-900/20 text-green-500' :
                                                order.status === 'PREPARING' ? 'border-yellow-600/50 bg-yellow-600/10 text-yellow-500' :
                                                    order.status === 'SHIPPED' ? 'border-blue-500/50 bg-blue-500/10 text-blue-500' :
                                                        'border-neutral-700 bg-neutral-900/50 text-neutral-500'
                                            }`}>
                                            {statusTranslations[order.status] || order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-neutral-900">
                                    <ul className="space-y-3">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="flex justify-between text-sm">
                                                <span className="text-neutral-400 font-bold"><span className="text-white">{item.quantity}x</span> {item.product.name}</span>
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
