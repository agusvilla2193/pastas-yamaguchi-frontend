'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthCore';
import { toast } from 'sonner';

// --- INTERFACES ESTRICTAS ---
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

type OrderStatus = 'ALL' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function AdminOrdersPage() {
    const { api } = useAuth();
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
    const [filterStatus, setFilterStatus] = useState<OrderStatus>('ALL');

    const fetchAllOrders = useCallback(async () => {
        try {
            const response = await api.get<AdminOrder[]>('/orders/all');
            setOrders(response.data);
        } catch {
            toast.error("No se pudieron cargar los pedidos");
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    // KPIs - Estadísticas del Dojo
    const stats = useMemo(() => {
        const today = new Date().toLocaleDateString();
        return {
            totalRevenue: orders.reduce((acc, o) => acc + Number(o.total), 0),
            activeKitchen: orders.filter(o => o.status === 'PREPARING').length,
            pendingShipment: orders.filter(o => o.status === 'PAID').length,
            todayCount: orders.filter(o => new Date(o.orderDate).toLocaleDateString() === today).length
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
        } catch {
            toast.error("Error al actualizar");
        }
    };

    return (
        <div className="pb-20">
            <header className="mb-12">
                <p className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Panel de Control</p>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter text-white">
                    Gestión de <span className="text-red-600">Pedidos</span>
                </h1>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                <StatCard label="Recaudación Total" value={`$${stats.totalRevenue.toLocaleString()}`} />
                <StatCard label="En Cocina" value={stats.activeKitchen} color="text-yellow-500" />
                <StatCard label="Por Despachar" value={stats.pendingShipment} color="text-green-500" />
                <StatCard label="Pedidos Hoy" value={stats.todayCount} color="text-red-600" />
            </div>

            {/* TABS DE FILTRADO */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {(['ALL', 'PAID', 'PREPARING', 'SHIPPED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${filterStatus === status
                            ? 'bg-red-600 border-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                            }`}
                    >
                        {status === 'ALL' ? 'Todos' : status === 'PAID' ? 'Nuevos' : status === 'PREPARING' ? 'Cocina' : 'En Camino'}
                    </button>
                ))}
            </div>

            {/* TABLA DE ÓRDENES */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-900 bg-neutral-900/30 font-black uppercase tracking-widest text-[9px] text-neutral-500">
                                <th className="p-6">ID</th>
                                <th className="p-6">Cliente</th>
                                <th className="p-6">Fecha</th>
                                <th className="p-6">Total</th>
                                <th className="p-6">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900">
                            {loading ? (
                                <SkeletonRows />
                            ) : (
                                filteredOrders.map((order) => (
                                    <OrderRow
                                        key={order.id}
                                        order={order}
                                        onViewDetail={() => setSelectedOrder(order)}
                                        onStatusChange={handleStatusChange}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DETALLE */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENTES (Para mantener el archivo bajo control) ---

const StatCard = ({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) => (
    <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-[2rem] backdrop-blur-sm">
        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500 mb-1">{label}</p>
        <p className={`text-3xl font-black italic tracking-tighter ${color}`}>{value}</p>
    </div>
);

const OrderRow = ({ order, onViewDetail, onStatusChange }: { order: AdminOrder, onViewDetail: () => void, onStatusChange: (id: number, s: string) => void }) => (
    <tr className="hover:bg-white/[0.02] transition-colors group">
        <td className="p-6 font-mono text-red-600 text-sm font-bold underline cursor-pointer hover:text-white" onClick={onViewDetail}>
            #{order.id}
        </td>
        <td className="p-6 cursor-pointer" onClick={onViewDetail}>
            <div className="flex flex-col">
                <span className="font-bold text-sm text-white">{order.user?.firstName || 'Usuario'} {order.user?.lastName || 'Dojo'}</span>
                <span className="text-[10px] text-neutral-500 font-mono italic">{order.user?.email}</span>
            </div>
        </td>
        <td className="p-6 text-sm text-neutral-400">
            {new Date(order.orderDate).toLocaleDateString()}
        </td>
        <td className="p-6 font-black text-white text-lg">
            ${Number(order.total).toLocaleString()}
        </td>
        <td className="p-6">
            <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
                className={`bg-black text-[10px] font-black uppercase px-4 py-2 rounded-xl border transition-all cursor-pointer outline-none appearance-none text-center ${getStatusStyles(order.status)}`}
            >
                <option value="PAID">Pagado</option>
                <option value="PREPARING">En Cocina</option>
                <option value="SHIPPED">En Camino</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
            </select>
        </td>
    </tr>
);

const OrderDetailModal = ({ order, onClose }: { order: AdminOrder, onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-10 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/20">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Comanda</h2>
                    <p className="text-red-600 font-mono text-xs tracking-widest">ORDEN #{order.id}</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-white transition-all">✕</button>
            </div>
            <div className="p-10">
                <div className="max-h-[40vh] overflow-y-auto pr-4 space-y-6">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b border-neutral-900/50 pb-6">
                            <div className="flex flex-col gap-1">
                                <span className="text-white font-black text-sm uppercase italic tracking-tight">{item.product.name}</span>
                                <span className="text-neutral-500 text-[10px] font-black uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded w-fit">Cant: {item.quantity}</span>
                            </div>
                            <p className="text-white font-black font-mono text-lg">${(item.priceAtPurchase * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-10 pt-8 border-t border-red-600/30 text-center">
                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Total Comanda</p>
                    <p className="text-5xl font-black text-white italic tracking-tighter mb-8">${Number(order.total).toLocaleString()}</p>
                    <button onClick={onClose} className="w-full bg-white text-black font-black uppercase italic text-sm py-5 rounded-2xl hover:bg-red-600 hover:text-white transition-all">Cerrar Comanda</button>
                </div>
            </div>
        </div>
    </div>
);

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'PAID': return 'border-green-900/50 text-green-500 hover:border-green-500';
        case 'PREPARING': return 'border-yellow-600/50 text-yellow-500 hover:border-yellow-500';
        case 'SHIPPED': return 'border-blue-500/50 text-blue-500 hover:border-blue-500';
        case 'DELIVERED': return 'border-neutral-700 text-neutral-500 hover:border-white';
        default: return 'border-red-900/50 text-red-500';
    }
};

const SkeletonRows = () => (
    <tr><td colSpan={5} className="p-20 text-center text-neutral-600 italic animate-pulse">Consultando rollos de pergamino...</td></tr>
);
