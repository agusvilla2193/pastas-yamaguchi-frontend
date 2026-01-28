export default function ProductsHeader({ isAdmin, onCreateClick }: { isAdmin: boolean, onCreateClick: () => void }) {
    return (
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="text-center md:text-left">
                <span className="text-red-600 font-black tracking-[0.4em] uppercase text-[10px]">La Carta</span>
                <h1 className="text-5xl font-black italic tracking-tighter mt-2">NUESTRAS <span className="text-red-600">PASTAS</span></h1>
            </div>
            {isAdmin && (
                <button onClick={onCreateClick} className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
                    + Crear Pasta
                </button>
            )}
        </div>
    );
}
