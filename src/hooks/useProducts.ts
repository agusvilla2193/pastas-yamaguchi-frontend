import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthCore';
import { Product, ProductFormData } from '@/types/product';
import { toast } from 'sonner';

export function useProducts() {
    const { api } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'create' | 'edit' | null;
        selectedProduct: Product | null;
    }>({ isOpen: false, type: null, selectedProduct: null });

    const fetchProducts = useCallback(async () => {
        try {
            // CAMBIO: Ahora la ruta es /admin/products
            const response = await api.get<Product[]>('/admin/products');
            setProducts(response.data);
        } catch {
            toast.error('No se pudieron cargar las pastas');
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const openCreate = () => setModalState({ isOpen: true, type: 'create', selectedProduct: null });
    const openEdit = (product: Product) => setModalState({ isOpen: true, type: 'edit', selectedProduct: product });
    const closeModal = () => setModalState({ isOpen: false, type: null, selectedProduct: null });

    const handleSave = async (formData: ProductFormData) => {
        try {
            const finalData = {
                ...formData,
                price: Number(formData.price.toString().replace(',', '.')),
                stock: Number(formData.stock)
            };

            if (modalState.type === 'create') {
                // CAMBIO: Ruta /admin/products
                const res = await api.post<Product>('/admin/products', finalData);
                setProducts(prev => [...prev, res.data]);
                toast.success('¡Nueva pasta creada!');
            } else {
                // CAMBIO: Ruta /admin/products/:id
                await api.patch(`/admin/products/${modalState.selectedProduct?.id}`, finalData);
                setProducts(prev => prev.map(p =>
                    p.id === modalState.selectedProduct?.id ? { ...p, ...finalData } : p
                ));
                toast.success('¡Pasta actualizada!');
            }
            closeModal();
        } catch {
            toast.error('Error al guardar el producto');
        }
    };

    const handleDelete = async (id: number) => {
        toast('¿Eliminar esta pasta?', {
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        // CAMBIO: Ruta /admin/products/:id
                        await api.delete(`/admin/products/${id}`);
                        setProducts(prev => prev.filter(p => p.id !== id));
                        toast.success('Producto eliminado');
                    } catch {
                        toast.error('Error al eliminar');
                    }
                }
            }
        });
    };

    return {
        products, loading, modalState,
        openCreate, openEdit, closeModal,
        handleSave, handleDelete
    };
}
