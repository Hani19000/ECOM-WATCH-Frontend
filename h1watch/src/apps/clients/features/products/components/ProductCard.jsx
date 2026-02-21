import { useProductCardLogic } from '../hooks/useProductCardLogic';

const ProductCard = ({ product, persistedVariant, onVariantChange }) => {
    const { name, description, mainImage } = product;
    const { state, actions } = useProductCardLogic(product, persistedVariant, onVariantChange);

    return (
        <div onClick={actions.handleNavigateToDetail} className="group relative bg-gradient-to-br from-white to-gray-50/30 rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-1 cursor-pointer">
            <div className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-[#ADA996]/30 transition-all duration-700 pointer-events-none" />

            <div className="relative block h-80 overflow-hidden bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#F0F0EF]">
                <img src={state.selectedVariant?.attributes?.image || mainImage} alt={name} className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.08] group-hover:brightness-105" />

                {/* BADGE PROMOTION - Ancré à gauche */}
                <div className="absolute top-6 left-0 z-10">
                    {state.hasPromo && (
                        <div className="bg-gray-900/95 pl-5 pr-4 py-2 rounded-r-lg shadow-md border-y border-r border-[#b4945d]/40 backdrop-blur-md transform -translate-x-1 group-hover:translate-x-0 transition-transform duration-500">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-[#b4945d] shadow-[0_0_4px_#b4945d66]"></div>
                                <span className="text-[9px] font-bold text-[#b4945d] uppercase tracking-[0.25em]">
                                    {state.discountBadge}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* BADGES STOCK - Flottant en haut à droite */}
                <div className="absolute top-6 right-5 z-10 flex flex-col items-end gap-2">
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

            <div className="p-7 flex flex-col gap-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 tracking-tight group-hover:text-[#ADA996] transition-colors duration-500">{name}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-medium">{description || "Collection Prestige"}</p>
                </div>

                {/* SÉLECTEURS COULEUR / TAILLE */}
                <div className="flex items-center justify-between pt-3 pb-4 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1.5 sm:gap-2">
                        {state.availableColors.map(color => {
                            const hasStock = actions.checkStock('color', color);
                            const isActive = state.selectedVariant?.attributes?.color === color;
                            const isLight = actions.isLightColor(color);
                            return (
                                <button
                                    key={color}
                                    onClick={(e) => { e.preventDefault(); actions.changeVariant('color', color); }}
                                    className={`relative w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 ${isActive ? 'ring-1 ring-offset-1 ring-[#ADA996] scale-110 shadow-sm' : 'hover:scale-105'} ${!hasStock ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                    style={{ backgroundColor: color, border: isLight ? '1px solid #e5e7eb' : '0.5px solid rgba(0,0,0,0.1)' }}
                                >
                                    {!hasStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-[0.5px] bg-gray-400 rotate-45" /></div>}
                                    {isActive && hasStock && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2" fill="none" viewBox="0 0 24 24" stroke={isLight ? '#374151' : 'white'} strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <select
                        className="appearance-none text-[10px] font-bold uppercase tracking-widest bg-white/50 border border-gray-200 rounded-md pl-1 py-1.5 outline-none cursor-pointer w-10"
                        value={state.selectedVariant?.attributes?.size || ""}
                        onChange={(e) => actions.changeVariant('size', e.target.value)}
                    >
                        {state.availableSizes.map(size => (
                            <option key={size} value={size}>{size}{!actions.checkStock('size', size) ? ' (Out)' : ''}</option>
                        ))}
                    </select>
                </div>

                {/* ZONE PRIX ET ACHAT */}
                <div className="flex items-center justify-between gap-4 pt-2 mt-auto">
                    <div className="flex flex-col min-w-25 shrink-0">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            {state.hasPromo ? (
                                <>
                                    <span className="text-xl md:text-2xl font-light text-[#b4945d]">{Number(state.discountedPrice).toLocaleString()}€</span>
                                    <span className="text-[11px] font-light text-gray-400 line-through">{Number(state.originalPrice).toLocaleString()}€</span>
                                </>
                            ) : (
                                <span className="text-2xl font-light text-gray-900">{Number(state.originalPrice).toLocaleString()}€</span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={actions.handleAddToCart}
                        disabled={state.isCurrentVariantOut}
                        className={`grow max-w-35 py-3 px-5 rounded-full text-[9px] uppercase tracking-[0.2em] font-bold transition-colors duration-300 ${state.isCurrentVariantOut ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-[#ADA996] shadow-lg active:scale-95"}`}
                    >
                        {state.isCurrentVariantOut ? "Épuisé" : "Acquérir"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;