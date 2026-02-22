import { useState, useEffect, useCallback } from 'react';
import { AdminOrderService } from '../api/adminOrder.service';
import toast from 'react-hot-toast';

export const useOrderDetailLogic = (orderId, isDrawerOpen, onCloseDrawer, onSuccessCallback) => {
    const [orderDetails, setOrderDetail] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [pendingStatusChange, setPendingStatusChange] = useState('');

    const fetchCompleteOrderData = useCallback(async () => {
        if (!orderId) return;
        setIsLoadingDetails(true);
        try {
            const data = await AdminOrderService.getById(orderId);
            setOrderDetail(data);
            setPendingStatusChange(data.status);
        } catch {
            toast.error('Impossible de charger les détails de cette commande.');
            onCloseDrawer();
        } finally {
            setIsLoadingDetails(false);
        }
    }, [orderId, onCloseDrawer]);

    // Chargement dynamique au moment de l'ouverture du tiroir
    useEffect(() => {
        if (isDrawerOpen && orderId) {
            fetchCompleteOrderData();
        } else {
            setOrderDetail(null);
        }
    }, [isDrawerOpen, orderId, fetchCompleteOrderData]);

    const handleSelectStatusChange = useCallback((event) => {
        setPendingStatusChange(event.target.value);
    }, []);

    const submitStatusUpdate = useCallback(async (event) => {
        event.preventDefault();
        if (pendingStatusChange === orderDetails?.status) return;

        setIsUpdatingStatus(true);
        try {
            await AdminOrderService.updateStatus(orderId, pendingStatusChange);
            toast.success('Statut de la commande mis à jour.');
            onSuccessCallback(); // Rafraîchit le tableau en arrière-plan
            await fetchCompleteOrderData(); // Rafraîchit les données du tiroir
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
        } finally {
            setIsUpdatingStatus(false);
        }
    }, [orderId, pendingStatusChange, orderDetails?.status, onSuccessCallback, fetchCompleteOrderData]);

    return {
        orderDetails,
        isLoadingDetails,
        isUpdatingStatus,
        pendingStatusChange,
        handleSelectStatusChange,
        submitStatusUpdate
    };
};