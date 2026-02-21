import api from "../../../../../api/axios.config";

export const AdminUserService = {
    getAll: async ({ page = 1, limit = 10, search = '' }) => {
        const params = new URLSearchParams({ page, limit, _t: Date.now() });
        if (search) params.append('search', search);

        const response = await api.get(`/users?${params.toString()}`);
        const usersData = response.data?.data?.users || response.data?.data || [];

        return {
            users: Array.isArray(usersData) ? usersData : [],
            pagination: response.data?.data?.pagination || { page: 1, totalPages: 1, total: 0 }
        };
    },

    update: async (userId, userPayload) => {
        const response = await api.patch(`/users/${userId}`, userPayload);
        return response.data;
    },

    delete: async (userId) => {
        await api.delete(`/users/${userId}`);
        return true;
    }
};