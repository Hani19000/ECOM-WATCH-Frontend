import api from "../../../../../api/axios.config";

export const AdminOrderService = {
    getAll: async ({ page = 1, limit = 10, search = '', status = '' }) => {
        const params = new URLSearchParams({ page, limit, _t: Date.now() });
        if (search) params.append('search', search);
        if (status) params.append('status', status);

        const response = await api.get(`/orders?${params.toString()}`);

        const responseData = response.data?.data || response.data || {};
        const ordersList = responseData.orders || responseData.data || [];
        const paginationData = responseData.pagination || response.data?.pagination || { page: 1, totalPages: 1, total: 0 };

        return {
            orders: Array.isArray(ordersList) ? ordersList : [],
            pagination: paginationData
        };
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