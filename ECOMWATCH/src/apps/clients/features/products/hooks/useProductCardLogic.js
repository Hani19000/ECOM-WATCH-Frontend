import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hooks/useCart';
import toast from 'react-hot-toast';

export const useProductCardLogic = (product, persistedVariant, onVariantChange) => {
    const { slug, name, variantsPreview = [] } = product;
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Détermination de la variante par défaut (avec image et en stock de préférence)
    const defaultVariant = useMemo(() => {
        if (!variantsPreview.length) return null;
        const idealVariant = variantsPreview.find(v => v.attributes?.image && (v.inventory?.availableStock > 0));
        const backUpVariant = variantsPreview.find(v => v.inventory?.availableStock > 0);
        return idealVariant || backUpVariant || variantsPreview.find(v => v.attributes?.image) || variantsPreview[0];
    }, [variantsPreview]);

    const selectedVariant = persistedVariant || defaultVariant;

    // Filtres disponibles
    const availableColors = useMemo(() => [...new Set(variantsPreview.map(v => v.attributes?.color))].filter(Boolean), [variantsPreview]);
    const availableSizes = useMemo(() => [...new Set(variantsPreview.map(v => v.attributes?.size))].filter(Boolean), [variantsPreview]);

    // Informations de stock
    const stockCount = selectedVariant?.inventory?.availableStock || 0;
    const isCurrentVariantOut = stockCount <= 0;

    // -----------------------------------------------------
    // LOGIQUE DE PROMOTION (Calculée sur la variante active)
    // -----------------------------------------------------
    const promo = selectedVariant?.promotion;
    const hasPromo = !!promo;
    const originalPrice = selectedVariant?.price || 0;
    const discountedPrice = promo?.discountedPrice || originalPrice;

    const discountBadge = hasPromo ?
        (promo.discountType === 'PERCENTAGE'
            ? `-${promo.discountValue}%`
            : `-${promo.discountValue}€`)
        : null;

    // Actions
    const handleNavigateToDetail = useCallback((e) => {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.closest('button')) return;
        navigate(`/product/${slug}`, { state: { initialVariantId: selectedVariant?.id } });
    }, [navigate, slug, selectedVariant]);

    const checkStock = useCallback((type, value) => {
        const variant = variantsPreview.find(v => v.attributes?.[type] === value);
        return (variant?.inventory?.availableStock || 0) > 0;
    }, [variantsPreview]);

    const changeVariant = useCallback((type, value) => {
        const newVariant = variantsPreview.find(v => v.attributes?.[type] === value);
        if (newVariant && onVariantChange) onVariantChange(newVariant);
    }, [variantsPreview, onVariantChange]);

    const handleAddToCart = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isCurrentVariantOut) return;

        const result = addToCart(product, selectedVariant);

        if (result.success) {
            toast.success(`${name} ajouté au panier`, { id: 'cart-success' });
        } else if (result.reason === 'already_exists') {
            toast.error(`${name} est déjà dans votre panier`, { id: 'already-in-cart' });
        }
    }, [addToCart, product, selectedVariant, isCurrentVariantOut, name]);

    const isLightColor = useCallback((color) => {
        if (!color) return false;
        return ['white', '#ffffff', '#fff', 'ivory', 'beige', 'cream'].some(c => color.toLowerCase().includes(c));
    }, []);

    return {
        state: {
            selectedVariant, availableColors, availableSizes, stockCount, isCurrentVariantOut,
            promo, hasPromo, originalPrice, discountedPrice, discountBadge
        },
        actions: { handleNavigateToDetail, checkStock, changeVariant, handleAddToCart, isLightColor }
    };
};