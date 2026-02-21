import api from "../../../../../api/axios.config";

export const AdminCategoryService = {
    getAll: async () => {
        const response = await api.get('/categories');
        const categoriesData = response.data?.data?.categories || response.data?.data || [];
        return Array.isArray(categoriesData) ? categoriesData : [];
    },

    create: async (categoryPayload) => {
        const response = await api.post('/categories', categoryPayload);
        return response.data;
    },

    update: async (categoryId, categoryPayload) => {
        const response = await api.patch(`/categories/${categoryId}`, categoryPayload);
        return response.data;
    },

    delete: async (categoryId) => {
        await api.delete(`/categories/${categoryId}`);
        return true;
    }
};