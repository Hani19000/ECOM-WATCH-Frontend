const ProductInfo = ({ name, description, selectedVariant }) => {
    const price = selectedVariant?.price || 0;
    const stock = selectedVariant?.inventory?.availableStock
        || selectedVariant?.inventory?.available_stock
        || 0;

    const hasPromo = selectedVariant?.promotion;
    const discountedPrice = hasPromo?.discountedPrice;

    return (
        <div className="space-y-8 md:space-y-10">
            {/* En-tête avec badge */}
            <div className="space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-[#ADA996] to-[#ADA996]" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.35em] md:tracking-[0.4em] text-[#ADA996]">
                        Haute Horlogerie
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#ADA996] to-transparent" />
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 uppercase tracking-tighter italic leading-[0.9]">
                    {name}
                </h1>
            </div>

            {/* Prix et disponibilité */}
            <div className="relative">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-8 border-b border-gray-100">
                    {/* Prix */}
                    <div className="space-y-2">
                        <span className="block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">
                            Prix Unitaire
                        </span>
                        <div className="flex items-baseline gap-3 flex-wrap">
                            {hasPromo ? (
                                <>
                                    <span className="text-3xl md:text-4xl font-light text-[#b4945d]">
                                        {discountedPrice}€
                                    </span>
                                    <span className="text-xl font-light text-gray-400 line-through">
                                        {price}€
                                    </span>
                                    <span className="px-3 py-1 bg-[#b4945d]/10 text-[#b4945d] text-[9px] font-black uppercase tracking-widest rounded-full">
                                        Promotion
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl md:text-4xl font-light text-gray-900">
                                    {price > 0 ? `${price.toLocaleString()}€` : 'Sur demande'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Badge stock */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${stock > 0
                            ? 'border-emerald-100 bg-emerald-50/50'
                            : 'border-red-100 bg-red-50/50'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'
                            }`} />
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] ${stock > 0 ? 'text-emerald-700' : 'text-red-600'
                            }`}>
                            {stock > 0 ? 'En Stock' : 'Épuisé'}
                        </span>
                    </div>
                </div>

                {/* Ligne décorative */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ADA996]/30 to-transparent" />
            </div>

            {/* Description */}
            <div className="space-y-3">
                <p className="text-sm md:text-base leading-relaxed text-gray-600 font-light">
                    {description}
                </p>

                {/* Informations supplémentaires */}
                <div className="flex flex-wrap items-center gap-4 pt-4 text-[9px] uppercase tracking-[0.25em] text-gray-400">
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Garantie 2 ans</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Livraison 48-72h</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;