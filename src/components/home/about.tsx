import Image from "next/image";

export default function About() {
    return (
        <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden border border-neutral-800 shadow-2xl">
                <Image
                    src="https://res.cloudinary.com/dfvj78jdc/image/upload/v1769035024/logo_instagram_svm54u.png"
                    alt="El arte de amasar"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                />
            </div>
            <div className="space-y-8">
                <div className="inline-block px-4 py-1 rounded-full border border-red-600/30 bg-red-600/5 text-red-500 text-[10px] font-bold uppercase tracking-widest">
                    Nuestra Historia
                </div>
                <h2 className="text-4xl md:text-5xl font-black italic leading-tight text-balance">
                    EL ARTE DEL <br /> <span className="text-red-600">AMASADO MANUAL</span>
                </h2>
                <p className="text-neutral-500 leading-relaxed text-lg">
                    Yamaguchi nace del respeto por la materia prima. En nuestra cocina, cada pasta
                    se cierra siguiendo técnicas artesanales, garantizando una textura
                    única que solo el tiempo y la dedicación pueden lograr. No es solo comida,
                    es un legado familiar en cada bocado.
                </p>
                <div className="grid grid-cols-2 gap-8 pt-4 border-t border-neutral-900">
                    <div>
                        <h4 className="text-white font-black text-3xl">100%</h4>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold mt-1">Natural & Casero</p>
                    </div>
                    <div>
                        <h4 className="text-white font-black text-3xl">Dojo</h4>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold mt-1">Sabor con Disciplina</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
