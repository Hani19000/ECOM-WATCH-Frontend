import api from '../../../../../api/axios.config';

export const adminInventoryService = {
    /**
     * Liste complète de l'inventaire (Pagination & Recherche)
     * Route: GET /api/v1/inventory
     */
    async getAll(params = { page: 1, limit: 15, search: '' }) {
        const { data } = await api.get('/inventory', { params });
        return data.data; // Retourne { items, pagination }
    },

    /**
     * Alertes de stock bas
     * Route: GET /api/v1/inventory/alerts
     */
    async getAlerts() {
        const { data } = await api.get('/inventory/alerts');
        return data.data.alerts;
    },

    /**
     * Ajustement manuel du stock (positif ou négatif)
     * Route: PATCH /api/v1/inventory/:variantId/adjust
     */
    async adjustStock(variantId, quantity, reason) {
        const { data } = await api.patch(`/inventory/${variantId}/adjust`, {
            quantity: Number(quantity),
            reason
        });
        return data.data.stock;
    },

    /**
     * Réapprovisionne une variante (ajout positif)
     * Route: PATCH /api/v1/inventory/restock/:variantId
     */
    async restockVariant(variantId, quantity) {
        const { data } = await api.patch(`/inventory/restock/${variantId}`, {
            quantity: Number(quantity)
        });
        return data.data.stock;
    }
};