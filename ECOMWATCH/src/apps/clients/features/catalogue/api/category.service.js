import api from '../../../../../api/axios.config';
import logger from '../../../../../core/utils/logger';

/**
 * Service Layer : Isole et normalise les réponses de l'API.
 * Protège le frontend des changements potentiels de structure du backend (ex: Strapi).
 */
export const CategoryService = {
    getAll: async () => {
        try {
            const response = await api.get('/categories');
            const rawData = response.data?.data?.categories
                || response.data?.data
                || response.data?.categories
                || [];

            return Array.isArray(rawData) ? rawData.map(cat => ({
                name: cat.name || cat,
                slug: cat.slug || (typeof cat === 'string' ? cat.toLowerCase() : cat.name?.toLowerCase())
            })) : [];
        } catch (error) {
            logger.error("Échec de la récupération des catégories", error);
            throw error;
        }
    }
};