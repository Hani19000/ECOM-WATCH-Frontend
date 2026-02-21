import { useMemo } from 'react';

/**
 * Génère des segments de prix intelligents basés sur la fourchette
 * @param {number} minPrice - Prix minimum
 * @param {number} maxPrice - Prix maximum
 * @returns {Array} Tableau de segments { label, min, max }
 */
function generatePriceSegments(minPrice, maxPrice) {
    const range = maxPrice - minPrice;

    // Si la fourchette est trop petite, ne pas créer de segments
    if (range < 1000) {
        return [];
    }

    // Arrondir à la centaine supérieure pour des segments propres
    const step = Math.ceil(range / 4 / 100) * 100;

    const segments = [
        {
            label: `${minPrice}€ - ${Math.min(minPrice + step, maxPrice)}€`,
            min: minPrice,
            max: Math.min(minPrice + step, maxPrice)
        },
        {
            label: `${minPrice + step}€ - ${Math.min(minPrice + step * 2, maxPrice)}€`,
            min: minPrice + step,
            max: Math.min(minPrice + step * 2, maxPrice)
        },
        {
            label: `${minPrice + step * 2}€ - ${Math.min(minPrice + step * 3, maxPrice)}€`,
            min: minPrice + step * 2,
            max: Math.min(minPrice + step * 3, maxPrice)
        },
        {
            label: `${minPrice + step * 3}€+`,
            min: minPrice + step * 3,
            max: maxPrice
        }
    ];

    // Filtrer les segments dupliqués
    const uniqueSegments = segments.filter((segment, index, self) =>
        index === self.findIndex(s => s.min === segment.min && s.max === segment.max)
    );

    return uniqueSegments;
}

/**
 * Hook pour calculer la fourchette de prix et générer les segments
 * @param {Array} products - Tableau de produits avec variantsPreview
 * @returns {Object} { minPrice, maxPrice, segments }
 */
export const usePriceRange = (products) => {
    return useMemo(() => {
        // Valeurs par défaut si pas de produits
        if (!products || !Array.isArray(products) || products.length === 0) {
            return {
                minPrice: 0,
                maxPrice: 10000,
                segments: []
            };
        }

        // Extraire tous les prix des variantes
        const allPrices = products.flatMap(product => {
            // Vérifier que le produit a des variantes
            if (!product?.variantsPreview || !Array.isArray(product.variantsPreview) || product.variantsPreview.length === 0) {
                return [];
            }

            // Extraire les prix valides des variantes
            return product.variantsPreview
                .map(variant => variant?.price || 0)
                .filter(price => price > 0); // Ignorer les prix à 0
        });

        // Si aucun prix valide trouvé, retourner des valeurs par défaut
        if (allPrices.length === 0) {
            return {
                minPrice: 0,
                maxPrice: 10000,
                segments: []
            };
        }

        // Calculer min et max
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);

        // Générer des segments de prix intelligents
        const segments = generatePriceSegments(minPrice, maxPrice);

        return {
            minPrice,
            maxPrice,
            segments
        };
    }, [products]);
};

export default usePriceRange;