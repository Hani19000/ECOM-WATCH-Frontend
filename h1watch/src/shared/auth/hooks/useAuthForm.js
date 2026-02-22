import { useCallback } from 'react';
import { useAuthStore } from './useAuthStore';
import { authService } from '../api/auth.service';
import { setAccessToken } from '../../../api/axios.config';
import { useProfile } from '../../../apps/clients/features/user/hooks/useProfile';
import { GuestOrderService } from '../../../apps/clients/features/orders/api/GuestOrder.service';
import logger from '../../../core/utils/logger';

export const useAuth = () => {
    const { user, isAuthenticated, setInitialized, isInitialized, setUser, logout: clearStore } = useAuthStore();
    const { refetch } = useProfile();

    /*
     * Synchronise le cache local des commandes invité avec la base de données.
     * Permet au client de retrouver son historique s'il s'inscrit ou se connecte après un achat.
     */
    const syncGuestOrders = (result) => {
        if (result.claimedOrderNumbers?.length > 0) {
            GuestOrderService.syncWithClaimed(result.claimedOrderNumbers);
            logger.info('[useAuth] Commandes transférées, cache invité synchronisé');
        } else if (result.claimedOrders > 0) {
            GuestOrderService.clearAll();
            logger.info('[useAuth] Cache invité purgé suite au rattachement total');
        }

        if (result.claimedOrders > 0) {
            setTimeout(() => refetch(), 1000);
        }
    };

    const register = async (userData) => {
        const result = await authService.register(userData);
        setAccessToken(result.accessToken);
        setUser(result.user);
        syncGuestOrders(result);
        return result.user;
    };

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        setAccessToken(result.accessToken);
        setUser(result.user);
        syncGuestOrders(result);
        return result.user;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setAccessToken(null);
            clearStore();
        }
    };

    const checkAuth = useCallback(async () => {
        try {
            const data = await authService.refresh();
            if (data?.user) {
                setUser(data.user);
                setAccessToken(data.accessToken);
            }
        } catch {
            setUser(null);
            setAccessToken(null);
        } finally {
            setInitialized(true);
        }
    }, [setUser, setInitialized]);

    return { user, isAuthenticated, isInitialized, login, register, logout, checkAuth };
};