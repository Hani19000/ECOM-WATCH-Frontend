const EmptyState = ({ message, onClearFilters }) => {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6">
            {/* Illustration élégante avec effet de profondeur */}
            <div className="relative mb-8">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ADA996] to-[#EAEAEA] opacity-20 blur-3xl rounded-full" />

                {/* Icône de montre */}
                <div className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-full border border-gray-200/50 shadow-xl">
                    <svg
                        className="w-20 h-20 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                    >
                        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                </div>
            </div>

            {/* Titre élégant */}
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                Aucune montre trouvée
            </h3>

            <p className="text-sm text-gray-400 mb-8 max-w-md text-center tracking-wide leading-relaxed">
                {message || "Nous n'avons trouvé aucun modèle correspondant à vos critères de recherche."}
            </p>

            {/* Bouton de réinitialisation */}
            {onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="group px-8 py-3.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-bold text-[11px] uppercase tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Réinitialiser les filtres
                </button>
            )}

            {/* Ligne décorative */}
            <div className="mt-12 pt-8 border-t border-gray-100 w-full max-w-md">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] text-center font-semibold">
                    Suggestions de recherche
                </p>
            </div>
        </div>
    );
};

export default EmptyState;