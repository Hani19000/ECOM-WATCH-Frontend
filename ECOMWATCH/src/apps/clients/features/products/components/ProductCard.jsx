import { useProductCardLogic } from '../hooks/useProductCardLogic';

/**
 * @component ProductCard
 *
 * Carte produit affichée sur la homepage et dans la grille par défaut.
 *
 * @param {object}   product          - Données du produit (name, description, mainImage, id…)
 * @param {object}   persistedVariant - Variante mémorisée pour ce produit (état global)
 * @param {function} onVariantChange  - Callback déclenché lors du changement de variante
 * @param {boolean}  isLCP            - true uniquement pour la 1ère carte de la homepage.
 *                                      Active fetchPriority="high" + loading="eager" sur l'image
 *                                      pour satisfaire l'audit Lighthouse "LCP request discovery".
 *                                      Toutes les autres cartes conservent loading="lazy".
 */
const ProductCard = ({ product, persistedVariant, onVariantChange, isLCP = false }) => {
    const { name, description, mainImage } = product;
    const { state, actions } = useProductCardLogic(product, persistedVariant, onVariantChange);

    return (
        <div
            onClick={actions.handleNavigateToDetail}
            className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 cursor-pointer"
        >
            {/* Bordure décorative au survol */}
            <div
                className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-[#ADA996]/30 transition-all duration-700 pointer-events-none"
                aria-hidden="true"
            />

            {/* ─── Visuel produit ──────────────────────────────────────────── */}
            <div className="relative block h-80 overflow-hidden bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#F0F0EF]">
                <img
                    src={state.selectedVariant?.attributes?.image || mainImage}
                    alt={name}
                    className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.08] group-hover:brightness-105"
                    /**
                     * LCP discovery (audit Lighthouse image 4) :
                     * - fetchPriority="high" → priorité maximale dans la file réseau du navigateur
                     * - loading="eager"      → désactive le lazy-loading pour que l'image soit
                     *                          incluse dans le document initial (discoverable)
                     *
                     * Ces attributs ne sont appliqués qu'à la première carte (isLCP=true),
                     * transmise par ProductGrid depuis la homepage uniquement.
                     * Pour toutes les autres cartes : fetchPriority="auto" + loading="lazy".
                     */
                    fetchPriority={isLCP ? 'high' : 'auto'}
                    loading={isLCP ? 'eager' : 'lazy'}
                />

                {/* Badge promotion */}
                <div className="absolute top-6 left-0 z-10" aria-hidden="true">
                    {state.hasPromo && (
                        <div className="bg-gray-900/95 pl-5 pr-4 py-2 rounded-r-lg shadow-md border-y border-r border-[#b4945d]/40 backdrop-blur-md transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-500">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#b4945d] shadow-[0_0_4px_#b4945d66]" />
                                <span className="text-[9px] font-bold text-[#b4945d] uppercase tracking-[0.25em]">
                                    {state.discountBadge}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Badge stock */}
                <div className="absolute top-6 right-5 z-10 flex flex-col items-end gap-2" aria-hidden="true">
                    {state.isCurrentVariantOut ? (
                        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Indisponible</span>
                        </div>
                    ) : state.stockCount < 5 && (
                        <div className="bg-[#ADA996]/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">Édition Limitée</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Contenu carte ───────────────────────────────────────────── */}
            <div className="p-7 flex flex-col gap-6">

                {/* Nom & description */}
                <div className="space-y-2">
                    <p className="text-xl font-semibold text-gray-900 tracking-tight group-hover:text-[#ADA996] transition-colors duration-500">
                        {name}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-medium">
                        {description || 'Collection Prestige'}
                    </p>
                </div>

                {/* ─── Sélecteurs couleur / taille ─────────────────────────── */}
                <div
                    className="flex items-center justify-between pt-3 pb-4 border-t border-gray-100"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Swatches couleur — zone de clic 24×24px minimum (WCAG 2.5.5) */}
                    <div className="flex gap-0.5" role="group" aria-label="Choisir une couleur">
                        {state.availableColors.map(color => {
                            const hasStock = actions.checkStock('color', color);
                            const isActive = state.selectedVariant?.attributes?.color === color;
                            const isLight = actions.isLightColor(color);

                            return (
                                <button
                                    key={color}
                                    onClick={(e) => { e.preventDefault(); actions.changeVariant('color', color); }}
                                    disabled={!hasStock}
                                    aria-label={`Couleur ${color}${!hasStock ? ' (indisponible)' : ''}${isActive ? ' (sélectionnée)' : ''}`}
                                    aria-pressed={isActive}
                                    className={`
                                        relative flex items-center justify-center
                                        w-6 h-6 rounded-full transition-all duration-300
                                        ${!hasStock ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    {/* Visuel swatch — taille visuelle inchangée, zone de clic étendue */}
                                    <span
                                        className={`
                                            relative block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full
                                            transition-all duration-300
                                            ${isActive ? 'ring-1 ring-offset-1 ring-[#ADA996] scale-110 shadow-sm' : 'hover:scale-105'}
                                        `}
                                        style={{
                                            backgroundColor: color,
                                            border: isLight ? '1px solid #e5e7eb' : '0.5px solid rgba(0,0,0,0.1)',
                                        }}
                                        aria-hidden="true"
                                    >
                                        {!hasStock && (
                                            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                                <span className="block w-full h-[0.5px] bg-gray-400 rotate-45" />
                                            </span>
                                        )}
                                        {isActive && hasStock && (
                                            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                                <svg
                                                    className="w-1.5 h-1.5 sm:w-2 sm:h-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke={isLight ? '#374151' : 'white'}
                                                    strokeWidth={4}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sélecteur de taille */}
                    <label htmlFor={`size-select-${product.id}`} className="sr-only">
                        Taille pour {name}
                    </label>
                    <select
                        id={`size-select-${product.id}`}
                        className="appearance-none text-[10px] font-bold uppercase tracking-widest bg-white/50 border border-gray-200 rounded-md pl-1 py-1.5 outline-none cursor-pointer w-10"
                        value={state.selectedVariant?.attributes?.size || ''}
                        onChange={(e) => actions.changeVariant('size', e.target.value)}
                    >
                        {state.availableSizes.map(size => (
                            <option key={size} value={size}>
                                {size}{!actions.checkStock('size', size) ? ' (Out)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ─── Prix & bouton d'achat ────────────────────────────────── */}
                <div className="flex items-center justify-between gap-4 pt-2 mt-auto">
                    <div className="flex flex-col min-w-25 shrink-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            {state.hasPromo ? (
                                <>
                                    <span className="text-xl md:text-2xl font-light text-[#b4945d]">
                                        {Number(state.discountedPrice).toLocaleString()}€
                                    </span>
                                    <span className="text-[11px] font-light text-gray-400 line-through">
                                        {Number(state.originalPrice).toLocaleString()}€
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-light text-gray-900">
                                    {Number(state.originalPrice).toLocaleString()}€
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={actions.handleAddToCart}
                        disabled={state.isCurrentVariantOut}
                        aria-label={state.isCurrentVariantOut ? `${name} épuisé` : `Ajouter ${name} au panier`}
                        className={`grow max-w-35 py-3 px-5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold transition-colors duration-300
                            ${state.isCurrentVariantOut
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-[#ADA996] shadow-lg active:scale-95'
                            }`}
                    >
                        {state.isCurrentVariantOut ? 'Épuisé' : 'Acquérir'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;