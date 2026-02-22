import api from '../../../../../api/axios.config';

/**
 * @module Service/AdminPromotion (Frontend)
 *
 * Couche d'accès aux données promotions pour le back-office.
 * Chaque méthode = un seul appel API, aucune logique métier ici.
 */
export const AdminPromotionService = {
    /**
     * Liste paginée des promotions avec filtre optionnel de statut.
     */
    getAll: async ({ page = 1, limit = 10, status } = {}) => {
        const params = new URLSearchParams({ page, limit, _t: Date.now() });
        if (status && status !== 'ALL') params.append('status', status);

        const { data } = await api.get(`/promotions?${params.toString()}`);
        return data.data;
    },

    getOne: async (id) => {
        const { data } = await api.get(`/promotions/${id}?_t=${Date.now()}`);
        return data.data.promotion;
    },

    /**
     * @param {object}   promotion   - Données de la promotion.
     * @param {string[]} productIds  - Produits ciblés au niveau produit (promo globale).
     * @param {string[]} variantIds  - Variantes ciblées individuellement (promo précise).
     */
    create: async (promotion, productIds = [], variantIds = []) => {
        const { data } = await api.post('/promotions', {
            promotion,
            linkedItems: { productIds, variantIds },
        });
        return data.data.promotion;
    },

    /**
     * @param {string}   id          - UUID de la promotion à modifier.
     * @param {object}   promotion   - Nouvelles données de la promotion.
     * @param {string[]} productIds  - Produits ciblés au niveau produit (promo globale).
     * @param {string[]} variantIds  - Variantes ciblées individuellement (promo précise).
     */
    update: async (id, promotion, productIds = [], variantIds = []) => {
        const { data } = await api.patch(`/promotions/${id}`, {
            promotion,
            linkedItems: { productIds, variantIds },
        });
        return data.data.promotion;
    },

    toggle: async (id) => {
        const { data } = await api.patch(`/promotions/${id}/toggle`);
        return data.data.promotion;
    },

    delete: async (id) => {
        await api.delete(`/promotions/${id}`);
        return true;
    },
};