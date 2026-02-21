export const CatalogueHeader = ({
    activeCategoryName,
    isAll,
    productsCount,
    isLoading,
    hasActiveFilters,
    onOpenFilters
}) => (
    <header className="mb-8 sm:mb-10 md:mb-12 pb-6 sm:pb-8 border-b border-gray-100">
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                    {isAll ? 'Collection Complète' : activeCategoryName}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 tracking-wide">
                    Explorez notre sélection de montres de prestige
                </p>
            </div>

            <div className="flex items-center justify-between gap-3">
                {!isLoading && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-gray-50 to-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full border border-gray-200/50 shadow-sm">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ADA996] animate-pulse" />
                        <span className="text-[10px] sm:text-[11px] text-gray-600 font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                            {productsCount} modèle{productsCount > 1 ? 's' : ''}
                        </span>
                    </div>
                )}

                <button
                    onClick={onOpenFilters}
                    className="lg:hidden relative flex items-center gap-2 bg-black text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg hover:bg-[#ADA996] transition-all duration-300 active:scale-95"
                >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                        Filtres
                    </span>
                    {hasActiveFilters && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#ADA996] rounded-full flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    </header>
);