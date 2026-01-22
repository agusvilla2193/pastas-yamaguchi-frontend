import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://res.cloudinary.com/dfvj78jdc/image/upload/v1769035024/logo_instagram_svm54u.png"
                    alt="Pastas Artesanales Yamaguchi"
                    fill
                    className="object-cover opacity-40 scale-105 animate-[slow-zoom_20s_ease-in-out_infinite_alternate]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/60 to-neutral-950" />
            </div>

            <div className="relative z-10 text-center px-6">
                <span className="text-red-600 font-black tracking-[0.5em] uppercase text-[10px] mb-4 block">
                    Tradición Artesanal desde 1972
                </span>
                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter mb-6">
                    YAMAGUCHI <span className="text-red-600 not-italic">PASTAS</span>
                </h1>
                <p className="text-neutral-400 max-w-lg mx-auto mb-10 text-base md:text-lg font-light leading-relaxed">
                    La precisión del arte japonés se funde con el corazón de la cocina italiana.
                    Descubra el sabor de la pasta hecha a mano, pieza por pieza.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/products"
                        className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl shadow-white/5"
                    >
                        Ver el Menú
                    </Link>
                </div>
            </div>
        </section>
    );
}
