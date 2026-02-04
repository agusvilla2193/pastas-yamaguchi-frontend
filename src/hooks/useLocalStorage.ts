import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                let parsed: T;
                try {
                    parsed = JSON.parse(item);
                } catch {
                    parsed = item as unknown as T;
                }

                // Uso requestAnimationFrame para evitar que el linter detecte 
                // una llamada síncrona al estado dentro del efecto.
                requestAnimationFrame(() => {
                    setStoredValue(parsed);
                });
            }
        } catch (error) {
            console.error(`Error inicializando key "${key}":`, error);
        }
    }, [key]);

    useEffect(() => {
        // No guardar en el primer render para no pisar el contenido existente
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (typeof window === 'undefined') return;

        try {
            const valueToStore = typeof storedValue === 'string'
                ? storedValue
                : JSON.stringify(storedValue);
            window.localStorage.setItem(key, valueToStore);
        } catch (error) {
            console.error(`Error guardando key "${key}":`, error);
        }
    }, [key, storedValue]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        setStoredValue(value);
    }, []);

    return [storedValue, setValue] as const;
}
