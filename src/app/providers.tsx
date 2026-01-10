'use client'; // ¡Marca este componente como Cliente para permitir el uso del Contexto!

import React from 'react';
// La ruta ahora es 'doble punto' para ir de 'app' a 'src' y luego a 'context'
import { AuthProvider } from '../context/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}
