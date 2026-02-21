import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../../products/hooks/useProducts'
import { useCategories } from './useCategories';
import usePriceRange from './usePriceRange';

/**
 * Centralise la synchronisation URL/État et le moteur de filtrage en mémoire.
 * Garantit que les URLs partagées (Deep Linking) appliquent directement les bons filtres.
 */
export const useCatalogueLogic = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({});

    // Lecture de l'état depuis l'URL (Source de vérité)
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'all';

    const { data: productsData, isLoading: isProductsLoading, isError, error, refetch } = useProducts({
        category: urlCategory === 'all' ? null : urlCategory
    });

    const { data: categories = [], isLoading: isCatsLoading } = useCategories();
    const { minPrice: dataMinPrice, maxPrice: dataMaxPrice, segments } = usePriceRange(productsData);

    const urlMinPrice = Number(searchParams.get('minPrice')) || dataMinPrice || 0;
    const urlMaxPrice = Number(searchParams.get('maxPrice')) || dataMaxPrice || 100000;

    // Mise à jour de l'URL pour persister les filtres
    const updateFilters = useCallback((newFilters) => {
        const params = {};
        if (newFilters.search) params.search = newFilters.search;
        if (newFilters.category && newFilters.category !== 'all') params.category = newFilters.category;
        if (newFilters.minPrice && newFilters.minPrice > dataMinPrice) params.minPrice = newFilters.minPrice;
        if (newFilters.maxPrice && newFilters.maxPrice < dataMaxPrice) params.maxPrice = newFilters.maxPrice;

        setSearchParams(params, { replace: true });
        setIsFiltersDrawerOpen(false);
    }, [dataMinPrice, dataMaxPrice, setSearchParams]);

    const handleCategoryChange = useCallback((slug) => {
        updateFilters({ search: urlSearch, category: slug, minPrice: urlMinPrice, maxPrice: urlMaxPrice });
    }, [updateFilters, urlSearch, urlMinPrice, urlMaxPrice]);

    const handleVariantChange = useCallback((productId, variant) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
    }, []);

    // Construction des onglets de navigation
    const categoryTabs = useMemo(() => {
        return [{ name: 'Tout', slug: 'all' }, ...categories];
    }, [categories]);

    const activeCategoryName = useMemo(() => {
        return categoryTabs.find(c => c.slug === urlCategory)?.name || 'Collection';
    }, [categoryTabs, urlCategory]);

    // Moteur de filtrage côté client
    const filteredProducts = useMemo(() => {
        const rawProducts = Array.isArray(productsData) ? productsData : (productsData?.data || []);

        return rawProducts.filter(product => {
            const matchesSearch = !urlSearch ||
                product.name.toLowerCase().includes(urlSearch.toLowerCase()) ||
                product.description?.toLowerCase().includes(urlSearch.toLowerCase());

            const hasValidPriceRange = typeof urlMinPrice === 'number' && typeof urlMaxPrice === 'number' && !isNaN(urlMinPrice) && !isNaN(urlMaxPrice);

            const matchesPrice = !hasValidPriceRange || product.variantsPreview?.some(v =>
                v.price >= urlMinPrice && v.price <= urlMaxPrice
            );

            return matchesSearch && matchesPrice;
        });
    }, [productsData, urlSearch, urlMinPrice, urlMaxPrice]);

    const hasActiveFilters = Boolean(
        urlSearch || urlCategory !== 'all' || urlMinPrice > dataMinPrice || urlMaxPrice < dataMaxPrice
    );

    return {
        state: {
            urlSearch, urlCategory, urlMinPrice, urlMaxPrice,
            dataMinPrice, dataMaxPrice, segments,
            categoryTabs, activeCategoryName,
            isFiltersDrawerOpen, selectedVariants, hasActiveFilters
        },
        data: {
            filteredProducts, isProductsLoading, isError, error, isCatsLoading
        },
        actions: {
            updateFilters, handleCategoryChange, handleVariantChange,
            setIsFiltersDrawerOpen, refetch
        }
    };
};