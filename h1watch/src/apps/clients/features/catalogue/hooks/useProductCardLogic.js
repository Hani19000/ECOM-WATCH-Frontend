import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/hooks/useCart';
import toast from 'react-hot-toast';

/**
 * Isole la logique complexe d'une carte produit multi-variantes.
 * Garantit que le composant visuel ne gère que le rendu et non les règles d'inventaire ou de navigation.
 */
export const useProductCardLogic = (product, persistedVariant, onVariantChange) => {
    const { slug, name, variantsPreview = [] } = product;
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Mémorisation de la variante par défaut pour éviter des recalculs à chaque rendu
    const defaultVariant = useMemo(() => {
        if (!variantsPreview.length) return null;
        const idealVariant = variantsPreview.find(v => v.attributes?.image && (v.inventory?.availableStock > 0));
        const backUpVariant = variantsPreview.find(v => v.inventory?.availableStock > 0);
        return idealVariant || backUpVariant || variantsPreview.find(v => v.attributes?.image) || variantsPreview[0];
    }, [variantsPreview]);

    const selectedVariant = persistedVariant || defaultVariant;

    // Dérivation de l'état (Lecture seule)
    const availableColors = useMemo(() => [...new Set(variantsPreview.map(v => v.attributes?.color))].filter(Boolean), [variantsPreview]);
    const availableSizes = useMemo(() => [...new Set(variantsPreview.map(v => v.attributes?.size))].filter(Boolean), [variantsPreview]);

    const stockCount = selectedVariant?.inventory?.availableStock || 0;
    const isCurrentVariantOut = stockCount <= 0;
    const promo = selectedVariant?.promotion;
    const hasPromo = !!promo;

    // Actions utilisateur
    const handleNavigateToDetail = useCallback((e) => {
        if (e.target.closest('button') || e.target.tagName === 'SELECT') return;
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
            toast.success(`${name} ajouté à votre collection`, {
                id: `cart-success-${selectedVariant.id}`,
                icon: '⌚',
                style: {
                    borderRadius: '12px', background: '#1a1a1a', color: '#fff',
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600'
                },
            });
        } else if (result.reason === 'already_exists') {
            toast.error(`${name} est déjà dans votre panier`, {
                id: `cart-error-${selectedVariant.id}`,
                icon: '⚠️',
                style: {
                    borderRadius: '12px', background: '#1a1a1a', color: '#fff',
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '600'
                },
            });
        }
    }, [addToCart, product, selectedVariant, isCurrentVariantOut, name]);

    const isLightColor = useCallback((color) => {
        if (!color) return false;
        return ['white', '#ffffff', '#fff', 'ivory', 'beige', 'cream'].some(c => color.toLowerCase().includes(c));
    }, []);

    return {
        state: {
            selectedVariant,
            availableColors,
            availableSizes,
            stockCount,
            isCurrentVariantOut,
            promo,
            hasPromo
        },
        actions: {
            handleNavigateToDetail,
            checkStock,
            changeVariant,
            handleAddToCart,
            isLightColor
        }
    };
};