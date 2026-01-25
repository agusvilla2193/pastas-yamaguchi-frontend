'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';

// Definimos la estructura exacta para evitar el "any"
interface OrderProduct {
    id: number;
    name: string;
    price: number;
}

interface OrderItem {
    id: number;
    quantity: number;
    priceAtPurchase: number;
    product: OrderProduct;
}

interface AdminOrder {
    id: number;
    orderDate: string;
    status: string;
    total: number | string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    items: OrderItem[];
}

export default function AdminOrdersPage() {
    const { api } = useAuth();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                // Llamamos al endpoint maestro que creamos en el controlador
                const response = await api.get<AdminOrder[]>('/orders/all');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error("No se pudieron cargar los pedidos del Dojo");
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrders();
    }, [api]);

    return (
        <div className="animate-in fade-in duration-700">
            <header className="mb-12">
                <p className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Panel de Control</p>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">
                    Gestión de <span className="text-red-600">Pedidos</span>
                </h1>
            </header>

            <div className="bg-neutral-950 border border-neutral-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-900 bg-neutral-900/30">
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">ID</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Cliente</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Fecha</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Total</th>
                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-neutral-500 italic animate-pulse">
                                    Cargando registros del Dojo...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-20 text-center text-neutral-500 italic">
                                    No hay pedidos registrados todavía.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6 font-mono text-red-600 text-sm font-bold">#{order.id}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-white">
                                                {order.user?.firstName} {order.user?.lastName}
                                            </span>
                                            <span className="text-[10px] text-neutral-500 font-mono italic">
                                                {order.user?.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-sm text-neutral-400">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-6 font-black text-white text-lg">
                                        ${Number(order.total).toLocaleString()}
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-900/50 bg-red-900/10 text-red-500">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
