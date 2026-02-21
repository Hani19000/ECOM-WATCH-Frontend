import { useProductCardLogic } from '../hooks/useProductCardLogic';

const CatalogueProductCard = ({ product, persistedVariant, onVariantChange }) => {
    const { name, description, mainImage } = product;
    const { state, actions } = useProductCardLogic(product, persistedVariant, onVariantChange);

    return (
        <div
            onClick={actions.handleNavigateToDetail}
            className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 cursor-pointer"
        >
            <div className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-[#ADA996]/30 transition-all duration-700 pointer-events-none" aria-hidden="true" />

            {/* VISUEL PRODUIT */}
            <div className="relative block h-[280px] md:h-[300px] overflow-hidden bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#F0F0EF]">
                <img
                    src={state.selectedVariant?.attributes?.image || mainImage}
                    alt={name}
                    className="w-full h-full object-contain object-center p-4 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:brightness-105"
                />

                <div className="absolute top-4 left-4 flex flex-col gap-2" aria-hidden="true">
                    {state.isCurrentVariantOut ? (
                        <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Indisponible</span>
                        </div>
                    ) : state.stockCount < 5 && (
                        <div className="bg-[#ADA996]/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">Édition Limitée</span>
                        </div>
                    )}
                </div>

                {!state.isCurrentVariantOut && state.hasPromo && (
                    <div className="absolute top-4 right-4 bg-black px-3 py-1.5 rounded-full shadow-xl animate-glow border border-[#ADA996]/30" aria-hidden="true">
                        <span className="text-[10px] font-black text-[#ADA996] uppercase tracking-widest">
                            -{state.promo.discountType === 'PERCENTAGE' ? `${state.promo.discountValue}%` : `${state.promo.discountValue}€`}
                        </span>
                    </div>
                )}
            </div>

            {/* CONTENU */}
            <div className="p-5 md:p-6 flex flex-col gap-4">
                <div className="space-y-1.5">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#ADA996] transition-colors duration-500">
                        {name}
                    </h3>
                    <p className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium line-clamp-1">
                        {description || "Collection Prestige"}
                    </p>
                </div>

                {/* SÉLECTEURS */}
                <div
                    className="flex items-center justify-between pt-2 pb-3 border-t border-gray-100"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Swatches couleur */}
                    <div className="flex gap-1.5 sm:gap-2" role="group" aria-label="Choisir une couleur">
                        {state.availableColors.slice(0, 4).map(color => {
                            const isAvailable = actions.checkStock('color', color);
                            const isActive = state.selectedVariant?.attributes?.color === color;
                            const isLight = actions.isLightColor(color);

                            return (
                                <button
                                    key={color}
                                    onClick={(e) => { e.preventDefault(); actions.changeVariant('color', color); }}
                                    disabled={!isAvailable}
                                    aria-label={`Couleur ${color}${!isAvailable ? ' (indisponible)' : ''}${isActive ? ' (sélectionnée)' : ''}`}
                                    aria-pressed={isActive}
                                    className={`relative w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full transition-all duration-300
                                        ${isActive ? 'ring-1 sm:ring-1.5 ring-offset-1 ring-[#ADA996] scale-110 shadow-sm' : 'hover:scale-105'}
                                        ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                    style={{
                                        backgroundColor: color,
                                        border: isLight ? '1px solid #e5e7eb' : '0.5px solid rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                            <div className="w-full h-[0.5px] bg-gray-400 rotate-45" />
                                        </div>
                                    )}
                                    {isActive && isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                            <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke={isLight ? '#374151' : 'white'} strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <label htmlFor={`size-select-${product.id}`} className="sr-only">
                        Taille pour {name}
                    </label>
                    <select
                        id={`size-select-${product.id}`}
                        className="appearance-none text-[10px] font-bold uppercase tracking-widest bg-white/50 border border-gray-200 rounded-md pl-1 py-1.5 outline-none cursor-pointer w-10"
                        value={state.selectedVariant?.attributes?.size || ""}
                        onChange={(e) => actions.changeVariant('size', e.target.value)}
                    >
                        {state.availableSizes.map(size => (
                            <option key={size} value={size} disabled={!actions.checkStock('size', size)}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* PRIX & ACTION */}
                <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
                    <div className="flex flex-col min-w-[90px] shrink-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            {state.hasPromo ? (
                                <>
                                    <span className="text-lg md:text-xl font-light text-[#b4945d] tracking-tight">{state.promo.discountedPrice}€</span>
                                    <span className="text-[10px] font-light text-gray-400 line-through">{state.selectedVariant?.price}€</span>
                                </>
                            ) : (
                                <span className="text-xl md:text-2xl font-light text-gray-900 tracking-tight">{state.selectedVariant?.price}€</span>
                            )}
                        </div>
                        <span className={`text-[8px] font-semibold uppercase tracking-[0.15em] ${state.isCurrentVariantOut ? 'text-red-500' : 'text-[#ADA996]'}`}>
                            {state.isCurrentVariantOut ? 'Rupture' : state.hasPromo ? 'Prix Privilège' : state.stockCount < 5 ? `Reste ${state.stockCount}` : 'En stock'}
                        </span>
                    </div>

                    <button
                        onClick={actions.handleAddToCart}
                        disabled={state.isCurrentVariantOut}
                        aria-label={state.isCurrentVariantOut ? `${name} épuisé` : `Ajouter ${name} au panier`}
                        className={`grow max-w-32.5 py-2.5 md:py-3 px-3 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold ${state.isCurrentVariantOut ? "bg-gray-100 text-gray-400" : "bg-black text-white hover:bg-[#ADA996] shadow-lg active:scale-95"}`}
                    >
                        {state.isCurrentVariantOut ? "Épuisé" : "Acquérir"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CatalogueProductCard;