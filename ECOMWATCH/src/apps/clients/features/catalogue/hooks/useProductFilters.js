import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api/axios.config';

export const useProductFilters = () => {
    return useQuery({
        queryKey: ['product-filters'],
        queryFn: async () => {
            const response = await api.get('/products/filters');
            return response.data.data;
        },
        staleTime: 1000 * 60 * 60, // On garde en cache 1h
    });
};