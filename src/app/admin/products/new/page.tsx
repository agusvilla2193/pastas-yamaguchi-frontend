'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthCore';
import ProductForm from '@/components/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useSyncExternalStore } from 'react';

// Función suscriptora simple para detectar cliente sin usar useEffect
const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function NewProductPage() {
    const { user } = useAuth();
    const { handleSave } = useProducts();
    const router = useRouter();

    // Técnica recomendada por React para detectar hidratación sin disparar useEffect
    const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    if (!isClient) return null;

    // Protección de Ruta
    if (user?.role !== 'admin') {
        return <AccessDenied onBack={() => router.push('/products')} />;
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white pb-20">
            <div className="max-w-4xl mx-auto py-16 px-6">

                <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-900 pb-10 gap-6">
                    <div>
                        <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px]">Gestión de Inventario</span>
                        <h1 className="text-5xl font-black italic tracking-tighter mt-2 uppercase">
                            NUEVA <span className="text-red-600">MAESTRÍA</span>
                        </h1>
                        <p className="text-neutral-500 mt-4 text-xs font-bold uppercase tracking-widest">
                            Define los detalles de la nueva pieza de nuestra carta.
                        </p>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="text-neutral-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center group"
                    >
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Volver
                    </button>
                </header>

                <div className="bg-neutral-900/30 border border-neutral-800 p-8 md:p-12 rounded-[3rem] shadow-2xl">
                    <ProductForm onSubmit={handleSave} />
                </div>

                <FooterDecoration />
            </div>
        </div>
    );
}

const AccessDenied = ({ onBack }: { onBack: () => void }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 px-6 text-center">
        <span className="text-red-600 font-black tracking-[0.5em] uppercase text-xs mb-4 animate-pulse">Acceso Prohibido</span>
        <h1 className="text-4xl font-black italic text-white tracking-tighter uppercase">ÁREA <span className="text-red-600">RESTRINGIDA</span></h1>
        <p className="text-neutral-500 mt-4 max-w-xs text-sm uppercase font-bold tracking-widest leading-relaxed">
            Solo los maestros del dojo tienen permiso para gestionar la carta.
        </p>
        <button
            onClick={onBack}
            className="mt-10 bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
            Volver al Inicio
        </button>
    </div>
);

const FooterDecoration = () => (
    <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
        <div className="h-[1px] w-12 bg-neutral-700" />
        <p className="text-center text-[9px] font-black uppercase tracking-[0.5em] text-neutral-500">
            Pastas Yamaguchi • Tradición de Calidad
        </p>
        <div className="h-[1px] w-12 bg-neutral-700" />
    </div>
);
