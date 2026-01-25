import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // 1. Lazy Initializer: Se ejecuta solo una vez al crear el estado
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                try {
                    return JSON.parse(item);
                } catch {
                    return item as unknown as T;
                }
            }
            return initialValue;
        } catch (error) {
            console.error(`Error inicializando key "${key}":`, error);
            return initialValue;
        }
    });

    // 2. Sincronizar con LocalStorage cuando el valor cambie
    // Aquí no llamamos a setState, por lo que el linter estará feliz
    useEffect(() => {
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

    // Usamos useCallback para que la función de actualizar sea estable
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        setStoredValue(value);
    }, []);

    return [storedValue, setValue] as const;
}
