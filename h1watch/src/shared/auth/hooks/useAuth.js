import { useAuthStore } from './useAuthStore';
import { authService } from '../api/auth.service';
import { setAccessToken } from '../../../api/axios.config';
import { useCallback } from 'react';
import { useProfile } from '../../../apps/clients/features/user/hooks/useProfile'
import { GuestOrderService } from '../../../apps/clients/features/orders/api/GuestOrder.service';

export const useAuth = () => {
    const { user, isAuthenticated, setInitialized, isInitialized, setUser, logout: clearStore } = useAuthStore();
    const { refetch } = useProfile();

    const register = async (userData) => {
        const result = await authService.register(userData);

        setAccessToken(result.accessToken);
        setUser(result.user);

        // Au registre, on ne retire QUE les commandes liées à cet email spécifique
        if (result.claimedOrderNumbers?.length > 0) {
            const { purged } = GuestOrderService.syncWithClaimed(result.claimedOrderNumbers);
            console.log(`[useAuth] register → ${purged} commande(s) purgée(s) du localStorage guest`);
        } else if (result.claimedOrders > 0) {
            GuestOrderService.clearAll();
            console.log(`[useAuth] register → localStorage guest vidé (${result.claimedOrders} commande(s) rattachée(s))`);
        }

        if (result.claimedOrders > 0) {
            setTimeout(() => refetch(), 1000);
        }

        return result.user;
    };

    const login = async (credentials) => {
        const { user, accessToken } = await authService.login(credentials);

        setAccessToken(accessToken);
        setUser(user);

        return user;
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

    return { user, isAuthenticated, setInitialized, isInitialized, register, login, logout, checkAuth };
};