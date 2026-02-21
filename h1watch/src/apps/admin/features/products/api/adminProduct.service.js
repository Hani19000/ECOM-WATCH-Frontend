import api from '../../../../../api/axios.config';
import logger from '../../../../../core/utils/logger';

/**
 * Normalise un produit brut du backend vers un format stable pour les composants.
 * Couvre tous les formats possibles selon que l'endpoint retourne la liste ou un détail.
 *
 * Formats catégorie connus :
 *   - { categoryName: 'Montres' }              → endpoint liste (jointure SQL directe)
 *   - { category_name: 'Montres' }             → variante snake_case
 *   - { category: { name: 'Montres' } }        → relation objet imbriqué
 *   - { categories: [{ name: 'Montres' }] }    → relation tableau (endpoint détail)
 */
const transformAdminProduct = (p) => {
    const variants = p.variantsPreview || p.variants_preview || p.variants || [];

    let imageUrl = p.mainImage || p.image?.url || p.imageUrl;
    if (!imageUrl && variants.length > 0) {
        imageUrl = variants[0]?.attributes?.image || variants[0]?.image?.url || null;
    }

    const displayCategory =
        p.categoryName ||
        p.category_name ||
        p.category?.name ||
        p.categories?.[0]?.name ||
        '-';

    return {
        ...p,
        mainImage: imageUrl,
        variantsPreview: variants,
        displayCategory,
    };
};

export const AdminProductService = {
    getAll: async ({ page = 1, limit = 10, search = '' }) => {
        const params = new URLSearchParams({ page, limit, status: 'ALL', _t: Date.now() });
        if (search) params.append('search', search);
        const { data } = await api.get(`/products?${params.toString()}`);
        const rawProducts = data?.data?.products || data?.data || [];
        return {
            products: Array.isArray(rawProducts) ? rawProducts.map(transformAdminProduct) : [],
            pagination: data?.data?.pagination || { page: 1, totalPages: 1, total: 0 }
        };
    },

    getOne: async (productId) => {
        const { data } = await api.get(`/products/${productId}`);
        return data?.data?.product || data?.data;
    },

    getCategories: async () => {
        try {
            const { data } = await api.get('/categories');
            const categoriesData = data?.data?.categories || data?.data || [];
            return Array.isArray(categoriesData) ? categoriesData : [];
        } catch (error) {
            logger.error('[AdminProductService] Erreur catégories', error);
            return [];
        }
    },

    create: async (formData) => {
        const { data } = await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    update: async (productId, jsonData) => {
        const { data } = await api.patch(`/products/${productId}`, jsonData);
        return data;
    },

    delete: async (productId) => {
        await api.delete(`/products/${productId}`);
        return true;
    },

    addVariant: async (productId, formData) => {
        const { data } = await api.post(`/products/${productId}/variants`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    updateVariant: async (variantId, jsonData) => {
        const { data } = await api.patch(`/products/variants/${variantId}`, jsonData);
        return data;
    },
};