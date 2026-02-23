import { useState, useEffect, useCallback } from 'react';
import { AdminOrderService } from '../api/adminOrder.service';
import toast from 'react-hot-toast';

export const useAdminOrders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [paginationData, setPaginationData] = useState({ page: 1, totalPages: 1, total: 0 });

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const fetchOrders = useCallback(async () => {
        setIsLoadingData(true);
        try {

            const filters = {
                search: debouncedSearchQuery,
                status: selectedStatusFilter
            };

            const result = await AdminOrderService.getAllOrders(
                filters,
                paginationData.page,
                10
            );

            setOrdersList(result.data?.orders || []);
            if (result.data?.pagination) {
                setPaginationData(previousState => ({ ...previousState, ...result.data.pagination }));
            }
        } catch {
            toast.error('Impossible de charger la liste des commandes.');
            setOrdersList([]);
        } finally {
            setIsLoadingData(false);
        }
    }, [paginationData.page, debouncedSearchQuery, selectedStatusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    /**
     * TableToolbar passe directement e.target.value (string) à onSearchChange.
     * On accepte donc une string, pas un event.
     */
    const handleSearchInputChange = useCallback((value) => {
        setSearchQuery(value);
        setPaginationData(previousState => ({ ...previousState, page: 1 }));
    }, []);

    /**
     * Appelé depuis OrdersAdmin avec (e.target.value) — reçoit une string directement.
     */
    const handleStatusFilterChange = useCallback((value) => {
        setSelectedStatusFilter(value);
        setPaginationData(previousState => ({ ...previousState, page: 1 }));
    }, []);

    const handlePageChange = useCallback((newPageNumber) => {
        if (newPageNumber >= 1 && newPageNumber <= paginationData.totalPages) {
            setPaginationData(previousState => ({ ...previousState, page: newPageNumber }));
        }
    }, [paginationData.totalPages]);

    return {
        state: { ordersList, isLoadingData, searchQuery, paginationData, selectedStatusFilter },
        actions: {
            handleSearchInputChange,
            handleStatusFilterChange,
            handlePageChange,
            fetchOrders
        }
    };
};