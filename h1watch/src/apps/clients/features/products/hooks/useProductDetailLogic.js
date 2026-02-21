import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductService from '../api/product.service';
import { useCart } from '../../cart/hooks/useCart';

/**
 * Hook métier pour la page détail produit.
 * Isole la gestion du cache serveur (React Query), du cache local (URL state) et 
 * l'algorithmique complexe de sélection de la variante par défaut.
 */
export const useProductDetailLogic = () => {
    const { slug } = useParams();
    const location = useLocation();
    const { addToCart } = useCart();

    const [selectedVariantState, setSelectedVariantState] = useState(null);
    const [prevSlug, setPrevSlug] = useState(slug);

    // Reset de l'état local si on navigue vers un autre produit
    if (slug !== prevSlug) {
        setPrevSlug(slug);
        setSelectedVariantState(null);
    }

    const { data: product, isLoading, isError } = useQuery({
        queryKey: ['product', slug],
        queryFn: () => ProductService.getOne(slug),
    });

    // Moteur de sélection intelligente de la variante
    const { variants, activeVariant } = useMemo(() => {
        if (!product) return { variants: [], activeVariant: null };

        const variantsList = product.variantsPreview || [];
        if (variantsList.length === 0) return { variants: [], activeVariant: null };

        let selected = null;

        // 1. Choix utilisateur actif
        if (selectedVariantState) {
            selected = selectedVariantState;
        }
        // 2. Choix venant de la navigation (deep link / catalogue)
        else if (location.state?.initialVariantId) {
            const variantFromNav = variantsList.find(v => v.id === location.state.initialVariantId);
            if (variantFromNav) selected = variantFromNav;
        }

        // 3. Fallback automatique : Première variante en stock
        if (!selected) {
            const inStockVariant = variantsList.find(v => (v.inventory?.availableStock || 0) > 0);
            if (inStockVariant) selected = inStockVariant;
        }

        // 4. Dernier fallback absolu
        if (!selected) selected = variantsList[0];

        return { variants: variantsList, activeVariant: selected };
    }, [product, selectedVariantState, location.state]);

    const handleAddToCart = (qty) => {
        return addToCart(product, activeVariant, qty);
    };

    return {
        product,
        isLoading,
        isError,
        variants,
        activeVariant,
        setSelectedVariantState,
        handleAddToCart
    };
};