import { useState } from "react";
import { toast } from "react-hot-toast";

const ProductActions = ({ name = "Produit", variants = [], selectedVariant, onVariantChange, onAddToCart }) => {
    const [quantityInput, setQuantityInput] = useState(1);

    const availableColors = [...new Set(variants.map(v => v.attributes?.color))].filter(Boolean);
    const availableSizes = [...new Set(variants.map(v => v.attributes?.size))].filter(Boolean);

    const maxStock = selectedVariant?.inventory?.availableStock
        || selectedVariant?.inventory?.available_stock
        || 0;

    const hasStock = maxStock > 0;
    const displayQuantity = Math.min(quantityInput, maxStock);

    const handleAddToCartClick = () => {
        if (!selectedVariant) return;
        const result = onAddToCart(displayQuantity);

        if (result && typeof result === 'object') {
            if (result.success) {
                toast.success(`${displayQuantity}x ${name} ajouté`, { id: 'cart-success' });
            } else if (result.reason === 'already_exists') {
                toast.error(`${name} est déjà dans le panier`, { id: 'cart-error' });
            }
        } else {
            toast.success(`${displayQuantity}x ${name} ajouté`, { id: 'cart-success' });
        }
    };

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Ligne de séparation décorative */}
            <div className="relative pt-8 md:pt-10">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" aria-hidden="true" />
            </div>

            {/* Sélecteur de tailles */}
            {availableSizes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-900">
                            Dimensions
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">
                            {selectedVariant?.attributes?.size}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-3" role="group" aria-label="Choisir une taille">
                        {availableSizes.map(size => {
                            const sizeVariant = variants.find(v => v.attributes?.size === size);
                            const sizeStock = sizeVariant?.inventory?.availableStock
                                || sizeVariant?.inventory?.available_stock
                                || 0;
                            const isSelected = selectedVariant?.attributes?.size === size;
                            const isOutOfStock = sizeStock === 0;

                            return (
                                <button
                                    key={size}
                                    onClick={() => {
                                        const variant = variants.find(v => v.attributes?.size === size);
                                        if (variant) {
                                            onVariantChange(variant);
                                            setQuantityInput(1);
                                        }
                                    }}
                                    disabled={isOutOfStock}
                                    aria-label={`Taille ${size}${isOutOfStock ? ' (épuisée)' : ''}${isSelected ? ' (sélectionnée)' : ''}`}
                                    aria-pressed={isSelected}
                                    className={`
                                        relative px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider
                                        transition-all duration-300
                                        ${isSelected
                                            ? 'bg-black text-white shadow-lg shadow-black/20 scale-105'
                                            : isOutOfStock
                                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-black hover:shadow-md'
                                        }
                                    `}
                                >
                                    {size}
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                            <div className="h-[1px] w-full bg-gray-300 rotate-12" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Sélecteur de couleurs */}
            {availableColors.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-900">
                            Finition
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium capitalize">
                            {selectedVariant?.attributes?.color}
                        </span>
                    </div>

                    <div className="flex gap-4" role="group" aria-label="Choisir une finition">
                        {availableColors.map(color => {
                            const colorVariant = variants.find(v => v.attributes?.color === color);
                            const colorStock = colorVariant?.inventory?.availableStock
                                || colorVariant?.inventory?.available_stock
                                || 0;
                            const isSelected = selectedVariant?.attributes?.color === color;
                            const isOutOfStock = colorStock === 0;

                            return (
                                <button
                                    key={color}
                                    onClick={() => {
                                        const match = variants.find(v => v.attributes?.color === color);
                                        if (match && colorStock > 0) {
                                            onVariantChange(match);
                                            setQuantityInput(1);
                                        }
                                    }}
                                    disabled={isOutOfStock}
                                    aria-label={`Finition ${color}${isOutOfStock ? ' (épuisée)' : ''}${isSelected ? ' (sélectionnée)' : ''}`}
                                    aria-pressed={isSelected}
                                    className={`
                                        relative w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300
                                        ${isSelected
                                            ? 'ring-4 ring-black ring-offset-2 scale-110 shadow-lg'
                                            : isOutOfStock
                                                ? 'opacity-20 cursor-not-allowed'
                                                : 'hover:scale-110 opacity-60 hover:opacity-100 ring-2 ring-gray-200'
                                        }
                                    `}
                                    style={{ backgroundColor: color }}
                                >
                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                                            <svg className="w-5 h-5 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Quantité et Ajout au panier */}
            <div className="space-y-4 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Sélecteur de quantité */}
                    <div
                        className="flex items-center border-2 border-gray-200 rounded-2xl px-5 py-3 bg-white hover:border-gray-300 transition-colors"
                        role="group"
                        aria-label="Quantité"
                    >
                        <button
                            onClick={() => setQuantityInput(q => Math.max(1, q - 1))}
                            aria-label="Diminuer la quantité"
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={!hasStock || quantityInput <= 1}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>

                        <span
                            className="flex-1 text-center text-sm font-black tabular-nums"
                            aria-live="polite"
                            aria-label={`Quantité : ${hasStock ? displayQuantity : 0}`}
                        >
                            {hasStock ? displayQuantity : 0}
                        </span>

                        <button
                            onClick={() => setQuantityInput(q => Math.min(maxStock, q + 1))}
                            aria-label="Augmenter la quantité"
                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={!hasStock || quantityInput >= maxStock}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {/* Bouton d'ajout au panier */}
                    <button
                        onClick={handleAddToCartClick}
                        disabled={!hasStock}
                        aria-label={hasStock ? `Ajouter ${displayQuantity} exemplaire${displayQuantity > 1 ? 's' : ''} de ${name} au panier` : `${name} en rupture de stock`}
                        className={`
                            flex-1 py-4 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em]
                            transition-all duration-300 relative overflow-hidden group
                            ${hasStock
                                ? 'bg-black text-white hover:bg-[#ADA996] shadow-xl shadow-black/20 hover:shadow-[#ADA996]/30 active:scale-[0.98]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {hasStock ? (
                                <>
                                    <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Ajouter au panier
                                </>
                            ) : (
                                'Rupture de stock'
                            )}
                        </span>
                        {hasStock && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Informations de stock */}
                <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.25em]">
                    <span className={hasStock ? 'text-gray-400' : 'text-red-500 font-bold'}>
                        {hasStock
                            ? `${maxStock} pièce${maxStock > 1 ? 's' : ''} disponible${maxStock > 1 ? 's' : ''}`
                            : 'Indisponible en réserve'
                        }
                    </span>

                    {hasStock && maxStock <= 5 && (
                        <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Stock limité
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductActions;