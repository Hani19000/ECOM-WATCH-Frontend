import { useCallback } from 'react';
import { useAuthStore } from './useAuthStore';
import { authService } from '../api/auth.service';
import { setAccessToken, clearAccessToken } from '../../../api/axios.config';
import { GuestOrderService } from '../../../apps/clients/features/orders/api/GuestOrder.service';
import logger from '../../../core/utils/logger';

export const useAuth = () => {
    const { user, isAuthenticated, isInitialized, setInitialized, setUser, logout: clearStore } = useAuthStore();

    // Rattache les commandes invité existantes au compte et purge le localStorage guest.
    // Séparé pour que register et login restent lisibles.
    const syncGuestOrders = useCallback((result) => {
        if (result.claimedOrderNumbers?.length > 0) {
            const { purged } = GuestOrderService.syncWithClaimed(result.claimedOrderNumbers);
            logger.debug(`[useAuth] ${purged} commande(s) guest synchronisée(s)`);
        } else if (result.claimedOrders > 0) {
            GuestOrderService.clearAll();
            logger.debug(`[useAuth] localStorage guest vidé`);
        }

        if (result.claimedOrders > 0) {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('profile:refresh')); // ← event custom
            }, 1000);
        }
    }, []);

    const register = useCallback(async (userData) => {
        const result = await authService.register(userData);
        setAccessToken(result.accessToken);
        setUser(result.user);
        syncGuestOrders(result);
        return result.user;
    }, [setUser, syncGuestOrders]);

    const login = useCallback(async (credentials) => {
        const result = await authService.login(credentials);
        setAccessToken(result.accessToken);
        setUser(result.user);
        syncGuestOrders(result);
        return result.user;
    }, [setUser, syncGuestOrders]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            clearAccessToken();
            clearStore();
        }
    }, [clearStore]);

    const checkAuth = useCallback(async () => {
        try {
            const data = await authService.refresh();
            if (data?.user) {
                setUser(data.user);
                setAccessToken(data.accessToken);
            }
        } catch {
            // Session expirée ou absente — comportement normal pour un visiteur
            setUser(null);
            clearAccessToken();
        } finally {
            setInitialized(true);
        }
    }, [setUser, setInitialized]);

    return { user, isAuthenticated, isInitialized, register, login, logout, checkAuth };
};