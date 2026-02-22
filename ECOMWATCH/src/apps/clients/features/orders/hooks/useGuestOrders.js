import { useState, useEffect, useCallback } from 'react';
import { GuestOrderService } from '../api/GuestOrder.service';

const CHANGE_EVENT = 'guestOrdersChanged';

export const useGuestOrders = () => {
    const [orders, setOrders] = useState(() => GuestOrderService.getOrders());

    const refreshOrders = useCallback(() => {
        setOrders(GuestOrderService.getOrders());
    }, []);

    const addOrder = useCallback((orderInfo) => {
        const success = GuestOrderService.addOrder(orderInfo);
        return success;
    }, []);

    const removeOrder = useCallback((identifier) => {
        return GuestOrderService.removeOrder(identifier);
    }, []);

    useEffect(() => {
        const handleSameTab = () => refreshOrders();

        const handleCrossTab = (e) => {
            if (e.key === 'h1_guest_orders') refreshOrders();
        };

        window.addEventListener(CHANGE_EVENT, handleSameTab);
        window.addEventListener('storage', handleCrossTab);

        return () => {
            window.removeEventListener(CHANGE_EVENT, handleSameTab);
            window.removeEventListener('storage', handleCrossTab);
        };
    }, [refreshOrders]);

    return {
        orders,
        hasOrders: orders.length > 0,
        addOrder,
        removeOrder,
        refreshOrders,
    };
};