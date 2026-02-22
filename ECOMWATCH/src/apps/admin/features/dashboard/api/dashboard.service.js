import api from '../../../../../api/axios.config';

/**
 * @service dashboardService
 * Responsabilité : communiquer avec l'API admin et retourner les données brutes.
 * Aucune transformation métier ici — c'est le rôle du hook.
 */
export const dashboardService = {

    async getStats() {
        const { data } = await api.get('/admin/stats');
        // CORRECTION : Si ton backend renvoie directement les stats dans data.data
        // on utilise un fallback logique (||) pour éviter le 'undefined'
        return data.data?.stats || data.data;
    },

    async getRecentOrders() {
        const { data } = await api.get('/orders', { params: { limit: 5 } });
        return data.data?.orders || data.data || [];
    },

    /**
     * Récupère les alertes de stock bas via le endpoint inventaire existant.
     * Retourne un tableau vide en cas d'erreur pour ne pas bloquer le dashboard.
     */
    async getStockAlerts() {
        const { data } = await api.get('/inventory/alerts');
        return data.data.alerts ?? [];
    },

    /**
     * Récupère l'historique des ventes journalières sur N jours.
     * Nécessite le endpoint GET /admin/sales-history exposé côté backend.
     */
    async getSalesHistory(days = 30) {
        const { data } = await api.get('/admin/sales-history', { params: { days } });
        return data.data.history ?? [];
    },
};