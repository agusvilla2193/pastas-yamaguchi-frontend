'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';

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
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await api.get<AdminOrder[]>('/orders/all');
                setOrders(response.data);
            } catch (error) {
                console.error('Error:', error);
                toast.error("No se pudieron cargar los pedidos");
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, [api]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Orden #${orderId} actualizada`);
        } catch (error) {
            toast.error("Error al actualizar");
        }
    };

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
                            <tr><td colSpan={5} className="p-20 text-center text-neutral-500 italic animate-pulse">Cargando registros...</td></tr>
                        ) : orders.map((order) => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                <td
                                    className="p-6 font-mono text-red-600 text-sm font-bold underline cursor-pointer hover:text-white"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    #{order.id}
                                </td>
                                <td className="p-6 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-white">{order.user?.firstName} {order.user?.lastName}</span>
                                        <span className="text-[10px] text-neutral-500 font-mono italic">{order.user?.email}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-sm text-neutral-400">{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className="p-6 font-black text-white text-lg">${Number(order.total).toLocaleString()}</td>
                                <td className="p-6">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`bg-black text-[10px] font-black uppercase px-3 py-1.5 rounded-full border transition-all cursor-pointer outline-none appearance-none text-center hover:border-white/40 ${order.status === 'PAID' ? 'border-green-900/50 text-green-500' :
                                                order.status === 'PREPARING' ? 'border-yellow-600/50 text-yellow-500' :
                                                    order.status === 'SHIPPED' ? 'border-blue-500/50 text-blue-500' :
                                                        order.status === 'DELIVERED' ? 'border-neutral-700 text-neutral-500' :
                                                            'border-red-900/50 text-red-500'
                                            }`}
                                    >
                                        <option value="PAID">Pagado</option>
                                        <option value="PREPARING">En Cocina</option>
                                        <option value="SHIPPED">En Camino</option>
                                        <option value="DELIVERED">Entregado</option>
                                        <option value="CANCELLED">Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL DE DETALLE */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.15)]">
                        <div className="p-8 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/20">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Detalle del Pedido</h2>
                                <p className="text-red-600 font-mono text-xs">ID #{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-neutral-500 hover:text-white transition-colors text-xl font-black">✕</button>
                        </div>
                        <div className="p-8">
                            <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center border-b border-neutral-900/50 pb-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm uppercase italic">{item.product.name}</span>
                                            <span className="text-neutral-500 text-xs font-mono">Cant: {item.quantity}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black font-mono">${(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-red-600/20 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Total Final</p>
                                    <p className="text-4xl font-black text-white italic tracking-tighter">${Number(selectedOrder.total).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="bg-red-600 text-white font-black uppercase italic text-xs px-8 py-3 rounded-full hover:bg-red-700 transition-all">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
