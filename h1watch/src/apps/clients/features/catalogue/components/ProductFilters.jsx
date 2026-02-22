export default function ProductFilters({
    filters,
    onFilterChange,
    categories = [],
    priceRange = { min: 0, max: 10000 },
    priceSegments = [],
    isMobile = false
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = ['minPrice', 'maxPrice'].includes(name) ? Number(value) : value;
        onFilterChange({ ...filters, [name]: finalValue });
    };

    const handleReset = () => {
        onFilterChange({
            search: '',
            category: 'all',
            minPrice: priceRange.min,
            maxPrice: priceRange.max
        });
    };

    const hasActiveFilters =
        filters.search ||
        filters.category !== 'all' ||
        filters.minPrice > priceRange.min ||
        filters.maxPrice < priceRange.max;

    return (
        <div className={`space-y-6 sm:space-y-8 ${isMobile ? 'p-0' : 'p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50/30 rounded-2xl border border-gray-100 shadow-sm'}`}>

            {/* Réservé à l'affichage Desktop */}
            {!isMobile && (
                <div className="pb-3 sm:pb-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#ADA996]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Affiner la recherche
                    </h3>
                </div>
            )}

            <div className="group space-y-2.5 sm:space-y-3">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-400 group-focus-within:text-[#ADA996] transition-colors duration-300">
                    Recherche
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="search"
                        placeholder="Nom, modèle, série..."
                        value={filters.search}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-200 rounded-lg sm:rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 pr-10 sm:pr-11 text-xs sm:text-sm outline-none focus:border-[#ADA996] focus:ring-2 focus:ring-[#ADA996]/10 transition-all placeholder:text-gray-300"
                    />
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#ADA996] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="space-y-2.5 sm:space-y-3">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-400">
                    Catégorie
                </label>
                <div className="space-y-1.5 sm:space-y-2">
                    <button
                        onClick={() => onFilterChange({ ...filters, category: 'all' })}
                        className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-between group ${filters.category === 'all' ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#ADA996]/30 hover:bg-gray-50 active:scale-98'}`}
                    >
                        <span className="uppercase tracking-wide font-semibold text-[10px] sm:text-[11px]">Toutes les catégories</span>
                        {filters.category === 'all' && <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />}
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => onFilterChange({ ...filters, category: cat.slug })}
                            className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-between group ${filters.category === cat.slug ? 'bg-gradient-to-r from-gray-900 to-black text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#ADA996]/30 hover:bg-gray-50 active:scale-98'}`}
                        >
                            <span className="uppercase tracking-wide font-semibold text-[10px] sm:text-[11px]">{cat.name}</span>
                            {filters.category === cat.slug && <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="space-y-3.5 sm:space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-gray-400">
                        Fourchette de prix
                    </label>
                    <span className="text-xs sm:text-sm font-light text-gray-900 tabular-nums">
                        {filters.minPrice.toLocaleString('fr-FR')}€ - {filters.maxPrice.toLocaleString('fr-FR')}€
                    </span>
                </div>

                <div className="space-y-3 sm:space-y-3.5">
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-medium">Minimum</label>
                        <input
                            type="range"
                            name="minPrice"
                            min={priceRange.min}
                            max={priceRange.max}
                            step="100"
                            value={filters.minPrice}
                            onChange={handleChange}
                            className="w-full h-2 sm:h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[#ADA996] [&::-webkit-slider-thumb]:to-[#c4bfa8] [&::-webkit-slider-thumb]:shadow-lg sm:[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:active:scale-110"
                        />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider font-medium">Maximum</label>
                        <input
                            type="range"
                            name="maxPrice"
                            min={priceRange.min}
                            max={priceRange.max}
                            step="100"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="w-full h-2 sm:h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-gray-900 [&::-webkit-slider-thumb]:to-black [&::-webkit-slider-thumb]:shadow-lg sm:[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:active:scale-110"
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-0.5 sm:pt-1">
                    <span className="text-[9px] sm:text-[10px] text-gray-300 font-semibold uppercase tracking-wider">{priceRange.min.toLocaleString('fr-FR')}€</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-300 font-semibold uppercase tracking-wider">{priceRange.max.toLocaleString('fr-FR')}€</span>
                </div>

                {priceSegments.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
                        {priceSegments.map((segment, index) => (
                            <button
                                key={index}
                                onClick={() => onFilterChange({ ...filters, minPrice: segment.min, maxPrice: segment.max })}
                                className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${filters.minPrice === segment.min && filters.maxPrice === segment.max ? 'bg-gray-900 text-white shadow-md scale-[1.02]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200'}`}
                            >
                                {segment.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {hasActiveFilters && (
                <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-[#ADA996]/30 hover:bg-gradient-to-br hover:from-[#ADA996]/5 hover:to-[#c4bfa8]/5 transition-all duration-300 group active:scale-98"
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réinitialiser les filtres
                </button>
            )}
        </div>
    );
}