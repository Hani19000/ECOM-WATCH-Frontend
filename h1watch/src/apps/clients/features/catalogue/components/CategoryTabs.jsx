/**
 * Composant de navigation par catégories.
 * Isole l'affichage des onglets et la gestion de leur état de chargement (Skeleton).
 * Permet au layout principal de rester déclaratif et concentré sur sa structure.
 */
export const CategoryTabs = ({ tabs = [], activeSlug, isLoading, onSelect }) => {
    return (
        <nav className="mb-8 sm:mb-10 md:mb-12 relative" aria-label="Navigation des catégories">
            <div className="flex overflow-x-auto scrollbar-hide items-center gap-1.5 sm:gap-2 md:gap-3 py-2 sm:py-3 justify-start md:justify-center -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0">

                {/* Affichage Skeleton pendant le chargement */}
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-9 sm:h-10 md:h-11 w-20 sm:w-24 bg-gray-100 rounded-full animate-pulse flex-shrink-0"
                            aria-hidden="true"
                        />
                    ))
                ) : (
                    /* Rendu des onglets */
                    tabs.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => onSelect(cat.slug)}
                            aria-current={activeSlug === cat.slug ? 'page' : undefined}
                            className={`
                                whitespace-nowrap px-3.5 sm:px-4 md:px-5 lg:px-6 
                                py-2 sm:py-2.5 md:py-3 rounded-full font-bold 
                                text-[9px] sm:text-[10px] md:text-[11px] 
                                uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-widest 
                                transition-all duration-500 transform flex-shrink-0
                                ${activeSlug === cat.slug
                                    ? 'bg-gradient-to-r from-gray-900 to-black text-white scale-105 shadow-lg'
                                    : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {cat.name}
                        </button>
                    ))
                )}
            </div>
        </nav>
    );
};