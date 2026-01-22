export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
    image?: string;
}

// esto lo usa el Formulario
export interface ProductFormData {
    name: string;
    description: string;
    category: string;
    price: number | string;
    stock: number | string;
    image?: string;
}
