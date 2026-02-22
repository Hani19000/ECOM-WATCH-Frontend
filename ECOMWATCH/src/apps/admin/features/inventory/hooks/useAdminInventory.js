import { useState, useCallback, useEffect } from 'react';
import { adminInventoryService } from '../api/adminInventory.service';
import toast from 'react-hot-toast';

export const useAdminInventory = () => {
    // État pour la liste globale
    const [inventory, setInventory] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({ page: 1, limit: 15, search: '' });
    const [loadingList, setLoadingList] = useState(false);

    // État pour les alertes
    const [alerts, setAlerts] = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(false);

    // État de mutation
    const [isUpdating, setIsUpdating] = useState(false);

    /**
     * Charge l'inventaire principal en fonction des filtres
     */
    const fetchInventory = useCallback(async (currentFilters) => {
        setLoadingList(true);
        try {
            const data = await adminInventoryService.getAll(currentFilters);
            setInventory(data.items || []);
            setPagination(data.pagination || null);
        } catch (err) {
            console.error('[useAdminInventory] Erreur fetchInventory:', err);
            toast.error("Impossible de charger l'inventaire.");
        } finally {
            setLoadingList(false);
        }
    }, []);

    /**
     * Charge les alertes de stock bas
     */
    const fetchAlerts = useCallback(async () => {
        setLoadingAlerts(true);
        try {
            const data = await adminInventoryService.getAlerts();
            setAlerts(data || []);
        } catch (err) {
            console.error('[useAdminInventory] Erreur fetchAlerts:', err);
        } finally {
            setLoadingAlerts(false);
        }
    }, []);

    /**
     * Ajuste manuellement le stock (Correction d'inventaire, perte, etc.)
     */
    const adjustStock = async (variantId, quantity, reason) => {
        setIsUpdating(true);
        try {
            await adminInventoryService.adjustStock(variantId, quantity, reason);
            toast.success('Stock ajusté avec succès');

            // On rafraîchit tout pour avoir des données parfaitement synchronisées
            fetchInventory(filters);
            fetchAlerts();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Échec de l'ajustement du stock.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    /**
     * Réassort de stock (Ajout de marchandise)
     */
    const restock = async (variantId, quantity) => {
        setIsUpdating(true);
        try {
            await adminInventoryService.restockVariant(variantId, quantity);
            toast.success('Réassort effectué avec succès');

            fetchInventory(filters);
            fetchAlerts();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Échec du réassort.");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    const updateFilters = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
    };

    // Auto-chargement
    useEffect(() => {
        fetchInventory(filters);
    }, [filters, fetchInventory]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    return {
        inventory,
        alerts,
        pagination,
        filters,
        loadingList,
        loadingAlerts,
        isUpdating,
        updateFilters,
        adjustStock,
        restock,
        refresh: () => {
            fetchInventory(filters);
            fetchAlerts();
        }
    };
};