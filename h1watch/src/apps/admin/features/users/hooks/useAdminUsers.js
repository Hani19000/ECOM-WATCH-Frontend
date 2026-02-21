import { useState, useEffect, useCallback } from 'react';
import { AdminUserService } from '../api/adminUser.service';
import toast from 'react-hot-toast';

export const useAdminUsers = () => {
    const [usersList, setUsersList] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [paginationData, setPaginationData] = useState({ page: 1, totalPages: 1, total: 0 });

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const fetchUsers = useCallback(async () => {
        setIsLoadingData(true);
        try {
            const result = await AdminUserService.getAll({
                page: paginationData.page,
                limit: 10,
                search: debouncedSearchQuery
            });
            setUsersList(result.users);
            setPaginationData(previousState => ({ ...previousState, ...result.pagination }));
        } catch {
            toast.error('Impossible de charger la liste des clients.');
            setUsersList([]);
        } finally {
            setIsLoadingData(false);
        }
    }, [paginationData.page, debouncedSearchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /**
     * TableToolbar passe directement e.target.value (string) — pas un event.
     */
    const handleSearchInputChange = useCallback((value) => {
        setSearchQuery(value);
        setPaginationData(previousState => ({ ...previousState, page: 1 }));
    }, []);

    const handlePageChange = useCallback((newPageNumber) => {
        if (newPageNumber >= 1 && newPageNumber <= paginationData.totalPages) {
            setPaginationData(previousState => ({ ...previousState, page: newPageNumber }));
        }
    }, [paginationData.totalPages]);

    const requestUserDeletion = useCallback((userId) => {
        setUserToDelete(userId);
    }, []);

    const cancelUserDeletion = useCallback(() => {
        setUserToDelete(null);
    }, []);

    const confirmUserDeletion = useCallback(async () => {
        if (!userToDelete) return;
        try {
            await AdminUserService.delete(userToDelete);
            toast.success('Compte client supprimé avec succès.');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression.');
        } finally {
            setUserToDelete(null);
        }
    }, [userToDelete, fetchUsers]);

    return {
        state: { usersList, isLoadingData, searchQuery, paginationData, userToDelete },
        actions: {
            handleSearchInputChange,
            handlePageChange,
            requestUserDeletion,
            cancelUserDeletion,
            confirmUserDeletion,
            fetchUsers
        }
    };
};