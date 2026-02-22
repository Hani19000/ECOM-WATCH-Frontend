import api from "../../../../../api/axios.config";
import logger from "../../../../../core/utils/logger";

const transformProductData = (p) => {
    const rawVariants = p.variantsPreview || p.variants_preview || p.variants || [];

    return {
        id: p.id || p._id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        mainImage: p.mainImage || p.image?.url || p.imageUrl,

        variantsPreview: Array.isArray(rawVariants) ? rawVariants.map(v => {
            const stockValue =
                v.inventory?.available_stock ??
                v.inventory?.availableStock ??
                0;

            return {
                id: v.id || v._id,
                price: parseFloat(v.price) || 0,
                promotion: v.promotion,
                inventory: {
                    availableStock: parseInt(stockValue) || 0
                },
                attributes: {
                    color: v.color || v.attributes?.color,
                    size: v.size || v.attributes?.size,
                    image: v.image?.url || v.imageUrl || v.attributes?.image
                }
            };
        }) : []
    };
};

const ProductService = {
    getAll: async (filters = {}) => {
        try {
            const { category, search, page, limit } = filters;
            const params = {
                categorySlug: category === 'all' ? undefined : category,
                search,
                page,
                limit,
                _t: Date.now()
            };

            const response = await api.get('/products', { params });
            const products = response.data?.data?.products || response.data?.data || [];

            if (!Array.isArray(products)) {
                logger.warn('[ProductService] Format invalide: expected array of products', products);
                return [];
            }

            return products.map(transformProductData);
        } catch (error) {
            logger.error('[ProductService] Échec de récupération des produits:', error);
            throw error;
        }
    },

    async getOne(idOrSlug) {
        try {
            const response = await api.get(`/products/${idOrSlug}`);
            const rawProduct = response.data?.data?.product || response.data?.data;

            if (!rawProduct) {
                logger.warn(`[ProductService] Produit introuvable: ${idOrSlug}`);
                return null;
            }

            return transformProductData(rawProduct);
        } catch (error) {
            logger.error(`[ProductService] Échec de récupération du produit ${idOrSlug}:`, error);
            return null;
        }
    },

    validateVariants: async (variantIds) => {
        try {
            const response = await api.post('/products/validate-variants', { variantIds });
            return { stockMap: response.data?.data?.stockMap || {} };
        } catch (error) {
            logger.error('[ProductService] Échec de validation des variantes:', error);
            return { stockMap: {} };
        }
    },

    findFeatured: async () => {
        try {
            const response = await api.get('/products', { params: { isFeatured: true, limit: 4, _t: Date.now() } });
            const products = response.data?.data?.products || response.data?.data || [];
            return Array.isArray(products) ? products.map(transformProductData) : [];
        } catch (error) {
            logger.error('[ProductService] Échec de récupération des produits featured:', error);
            return [];
        }
    },

    getMaxProductPrice: (products) => {
        if (!products || !Array.isArray(products) || products.length === 0) return 10000;
        const maxPrice = Math.max(...products.map(p => {
            const variantPrices = p.variantsPreview?.map(v => v.price) || [0];
            return Math.max(...variantPrices);
        }));
        return maxPrice > 0 ? maxPrice : 10000;
    },

    generateSegments: (maxPrice, customSegments = null) => {
        if (customSegments && customSegments.length > 0) return customSegments;
        const step = Math.ceil(maxPrice / 4 / 500) * 500;
        return [
            { label: `0€ - ${step}€`, max: step },
            { label: `${step}€ - ${step * 2}€`, max: step * 2 },
            { label: `${step * 2}€ - ${step * 3}€`, max: step * 3 },
            { label: `Tout voir`, max: Math.max(maxPrice, 10000) }
        ];
    },

    getProductBySlug: async (slug) => await ProductService.getOne(slug),

    getRelatedProducts: async (category) => {
        try {
            const { data } = await api.get(`/products/related?category=${category}`);
            return data;
        } catch (error) {
            logger.error('[ProductService] Échec de récupération des produits liés:', error);
            return { data: [] };
        }
    }
};

export default ProductService;