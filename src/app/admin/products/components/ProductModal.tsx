import ProductForm from '@/components/ProductForm';
import { Product, ProductFormData } from '@/types/product';

interface ProductModalProps {
    state: { isOpen: boolean; type: 'create' | 'edit' | null; selectedProduct: Product | null };
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void;
}

export default function ProductModal({ state, onClose, onSubmit }: ProductModalProps) {
    if (!state.isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-[3rem] overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-neutral-900 flex justify-between items-center">
                    <h2 className="text-xl font-black italic uppercase">
                        {state.type === 'create' ? 'Nueva Pasta' : `Editar: ${state.selectedProduct?.name}`}
                    </h2>
                    <button onClick={onClose} className="text-2xl text-neutral-500 hover:text-white transition-colors">
                        &times;
                    </button>
                </div>
                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <ProductForm
                        onSubmit={onSubmit}
                        initialData={state.selectedProduct ?? undefined}
                    />
                </div>
            </div>
        </div>
    );
}
