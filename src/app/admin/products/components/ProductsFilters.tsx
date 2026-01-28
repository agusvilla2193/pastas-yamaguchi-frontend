
interface ProductsFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    filter: string;
    setFilter: (category: string) => void;
}

export default function ProductsFilters({
    searchQuery,
    setSearchQuery,
    filter,
    setFilter
}: ProductsFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-12">
            {/* Buscador */}
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="Buscar pasta..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-red-600 outline-none transition-all placeholder:text-neutral-700"
                />
                <svg className="w-5 h-5 absolute left-4 top-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Selector de Categorías */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['Todas', 'Simples', 'Rellenas', 'Salsas'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${filter === cat
                            ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    );
}
