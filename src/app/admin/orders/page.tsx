'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'PREPARING' | 'SHIPPED'>('ALL');

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const response = await api.get<AdminOrder[]>('/orders/all');
                setOrders(response.data);
            } catch (error) {
                toast.error("No se pudieron cargar los pedidos");
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, [api]);

    // Estadísticas calculadas en tiempo real
    const stats = useMemo(() => {
        const today = new Date().toLocaleDateString();
        const dailyOrders = orders.filter(o => new Date(o.orderDate).toLocaleDateString() === today);

        return {
            totalRevenue: orders.reduce((acc, o) => acc + Number(o.total), 0),
            activeKitchen: orders.filter(o => o.status === 'PREPARING').length,
            pendingShipment: orders.filter(o => o.status === 'PAID').length,
            todayCount: dailyOrders.length
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (filterStatus === 'ALL') return orders;
        return orders.filter(o => o.status === filterStatus);
    }, [orders, filterStatus]);

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
        <div className="animate-in fade-in duration-700 pb-20">
            <header className="mb-12">
                <p className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Panel de Control</p>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">
                    Gestión de <span className="text-red-600">Pedidos</span>
                </h1>
            </header>

            {/* SECCIÓN DE STATS (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Recaudación Total', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'text-white' },
                    { label: 'En Cocina', value: stats.activeKitchen, color: 'text-yellow-500' },
                    { label: 'Por Despachar', value: stats.pendingShipment, color: 'text-green-500' },
                    { label: 'Pedidos de Hoy', value: stats.todayCount, color: 'text-red-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-[2rem] backdrop-blur-sm">
                        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">{stat.label}</p>
                        <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* FILTROS DE TABS */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(['ALL', 'PAID', 'PREPARING', 'SHIPPED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status
                                ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                            }`}
                    >
                        {status === 'ALL' ? 'Todos' : status === 'PAID' ? 'Nuevos' : status === 'PREPARING' ? 'En Cocina' : 'En Camino'}
                    </button>
                ))}
            </div>

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
                        ) : filteredOrders.map((order) => (
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
                                        className={`bg-black text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-all cursor-pointer outline-none appearance-none text-center hover:border-white/40 ${order.status === 'PAID' ? 'border-green-900/50 text-green-500' :
                                                order.status === 'PREPARING' ? 'border-yellow-600/50 text-yellow-500' :
                                                    order.status === 'SHIPPED' ? 'border-blue-500/50 text-blue-500' :
                                                        order.status === 'DELIVERED' ? 'border-neutral-700 text-neutral-500' : 'border-red-900/50 text-red-500'
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

            {/* MODAL DE DETALLE (Mantenemos tu lógica pero con un toque visual extra) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.1)]">
                        <div className="p-10 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/20">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Comanda</h2>
                                <p className="text-red-600 font-mono text-xs tracking-widest">ORDEN #{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all">✕</button>
                        </div>
                        <div className="p-10">
                            <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start border-b border-neutral-900/50 pb-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-white font-black text-sm uppercase italic tracking-tight">{item.product.name}</span>
                                            <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded w-fit">Cantidad: {item.quantity}</span>
                                        </div>
                                        <p className="text-white font-black font-mono text-lg">${(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-10 pt-8 border-t border-red-600/30">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Total a Cobrar</p>
                                        <p className="text-5xl font-black text-white italic tracking-tighter">${Number(selectedOrder.total).toLocaleString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="w-full bg-white text-black font-black uppercase italic text-sm py-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl">Entendido</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
