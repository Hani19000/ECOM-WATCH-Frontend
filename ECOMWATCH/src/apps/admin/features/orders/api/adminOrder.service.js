import api from "../../../../../api/axios.config";

export const AdminOrderService = {
    getAllOrders: async (filters = {}, page = 1, limit = 20) => {
        const params = new URLSearchParams();

        if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);

        // Ajout des paramètres de pagination
        params.append('page', page);
        params.append('limit', limit);

        // On utilise "api" ici
        const response = await api.get(`/orders?${params.toString()}`);
        return response.data;
    },

    getById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data?.data?.order || response.data?.data;
    },

    updateStatus: async (orderId, newStatus) => {
        const response = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
        return response.data;
    }
};