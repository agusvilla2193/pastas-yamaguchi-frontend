'use client';

import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/FormElements';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export default function RegisterPage() {
    const { formData, isLoading, handleInputChange, executeRegister } = useRegisterForm();

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8 bg-neutral-950 border border-neutral-900 p-10 rounded-[2.5rem] shadow-2xl">
                <div className="text-center">
                    <span className="text-red-600 font-black tracking-[0.3em] uppercase text-[10px]">Unirse a la familia</span>
                    <h2 className="text-4xl font-black italic tracking-tighter mt-2">CREAR <span className="text-red-600">CUENTA</span></h2>
                </div>

                <form onSubmit={executeRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            placeholder="Nombre" required
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                        <Input
                            placeholder="Apellido" required
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                    </div>
                    <Input
                        type="email" placeholder="Email" required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    <Input
                        type="password" placeholder="Contraseña" required
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-red-600 text-white font-black py-5 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50 active:scale-[0.98]"
                    >
                        {isLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
                    </button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-neutral-500 text-[10px] uppercase font-black tracking-widest">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/login" className="text-white hover:text-red-600 transition-colors ml-1">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
