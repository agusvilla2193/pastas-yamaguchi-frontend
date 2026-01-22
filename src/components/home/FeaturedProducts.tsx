import Image from "next/image";
import Link from "next/link";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
    return (
        <section className="py-24 bg-neutral-900/10 border-t border-neutral-800/30">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-red-600 font-black tracking-widest text-[10px] uppercase">Selección del Chef</span>
                        <h2 className="text-4xl font-black italic mt-2 uppercase">Nuestros <span className="text-red-600">Favoritos</span></h2>
                    </div>
                    <Link href="/products" className="text-sm font-bold border-b-2 border-red-600 pb-1 hover:text-red-500 transition-colors uppercase tracking-widest">
                        Ver toda la carta →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((p) => (
                        <div key={p.id} className="group relative bg-neutral-900/40 rounded-[2.5rem] border border-neutral-800/50 p-4 transition-all duration-500 hover:border-red-600/30 shadow-xl">
                            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-6">
                                <Image
                                    src={p.image || 'https://via.placeholder.com/400x300'}
                                    alt={p.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold">
                                    ${p.price}
                                </div>
                            </div>
                            <div className="px-4 pb-4 text-center">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors uppercase tracking-tighter">{p.name}</h3>
                                <p className="text-neutral-500 text-xs line-clamp-2 italic mb-6">
                                    {p.description}
                                </p>
                                <Link href="/products" className="inline-block w-full py-3 rounded-xl bg-neutral-800 text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-all duration-300">
                                    Pedir ahora
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
