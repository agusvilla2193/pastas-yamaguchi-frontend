'use client';

import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/FormElements';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
    const { user, formData, setFormData, isLoading, handleSubmit } = useProfile();

    if (!user) {
        return (
            <div className="text-center mt-20 text-white uppercase font-black animate-pulse">
                Cargando datos del guerrero...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-neutral-950 border border-neutral-900 p-10 rounded-[2.5rem] shadow-2xl">
                <header className="mb-8 border-b border-neutral-900 pb-6">
                    <h2 className="text-3xl font-black italic uppercase text-white">
                        Mi <span className="text-red-600">Perfil</span>
                    </h2>
                    <p className="text-neutral-500 text-xs uppercase tracking-widest mt-1">
                        Gestiona tu información de entrega
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label>Nombre</Label>
                            <Input
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <Label>Apellido</Label>
                            <Input
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Teléfono de Contacto</Label>
                        <Input
                            placeholder="Ej: +54 9 11 1234-5678"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Dirección de Entrega (Dojo)</Label>
                        <Input
                            placeholder="Calle, Número, Departamento..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-red-900/20"
                    >
                        {isLoading ? 'Guardando cambios...' : 'Actualizar Información'}
                    </button>
                </form>

                {/* --- SECCIÓN DE SEGURIDAD --- */}
                <div className="mt-12 pt-8 border-t border-neutral-900">
                    <header className="mb-6">
                        <h3 className="text-xl font-black italic uppercase text-white">Seguridad</h3>
                        <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">Tu llave de acceso al Dojo</p>
                    </header>

                    <div className="bg-neutral-900/30 border border-neutral-800/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <p className="text-white text-xs font-bold uppercase tracking-tight">Contraseña</p>
                            <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] mt-1">••••••••••••</p>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="bg-neutral-800 hover:bg-white hover:text-black text-white text-[9px] font-black px-6 py-2.5 rounded-xl transition-all uppercase tracking-widest border border-neutral-700"
                        >
                            Cambiar Contraseña
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 mb-2 block">
        {children}
    </label>
);
