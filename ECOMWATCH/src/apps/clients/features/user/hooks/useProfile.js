import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../../../shared/auth/hooks/useAuthStore';
import { userService } from '../api/user.service';
import logger from '../../../../../core/utils/logger';
import toast from 'react-hot-toast';

export const useProfile = () => {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const [changingPassword, setChangingPassword] = useState(false);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        if (!isAuthenticated || !isInitialized) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { user } = await userService.getProfile();

            if (!user) throw new Error('Format de réponse invalide');

            const userStats = user.stats || { totalOrders: 0, pendingOrders: 0, totalSpent: 0 };
            const { stats: _, ...profileData } = user;

            setProfile(profileData);
            setStats(userStats);

        } catch (err) {
            logger.error('[useProfile] Erreur lors du chargement:', err);

            if (err.response?.status === 401) {
                setError('Session expirée, veuillez vous reconnecter');
            } else if (err.response?.status === 429) {
                setError('Trop de requêtes, veuillez patienter');
            } else {
                setError('Impossible de charger le profil');
                toast.error('Erreur lors du chargement du profil');
            }
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, isInitialized]);

    const updateProfile = useCallback(async (updates) => {
        if (!isAuthenticated) return;
        if (!updates || Object.keys(updates).length === 0) return;

        const previousProfile = { ...profile };

        try {
            setUpdating(true);
            setProfile(prev => ({ ...prev, ...updates })); // Optimistic update

            const { user } = await userService.updateProfile(updates);

            if (user) {
                const { stats: _, ...updatedProfile } = user;
                setProfile(prev => ({ ...prev, ...updatedProfile }));
                toast.success('Profil mis à jour avec succès');
            }
        } catch (err) {
            logger.error('[useProfile] Erreur lors de la mise à jour:', err);
            setProfile(previousProfile); // Rollback

            if (err.response?.status === 400) {
                toast.error(err.response.data?.message || 'Données invalides');
            } else if (err.response?.status === 429) {
                toast.error('Trop de modifications, veuillez patienter');
            } else {
                toast.error('Erreur lors de la mise à jour');
            }
            throw err;
        } finally {
            setUpdating(false);
        }
    }, [profile, isAuthenticated]);

    const changePassword = useCallback(async (oldPassword, newPassword) => {
        if (!isAuthenticated) return false;

        try {
            setChangingPassword(true);
            await userService.updatePassword(oldPassword, newPassword);
            toast.success('Mot de passe mis à jour avec succès');
            return true;
        } catch (err) {
            const status = err.response?.status;
            const message = err.response?.data?.message;

            if (status === 401) {
                toast.error('Votre session a expiré. Reconnexion nécessaire.');
            } else if (status === 400) {
                toast.error(message || 'Données invalides');
            } else if (status === 429) {
                toast.error('Trop de tentatives. Réessayez dans 15 minutes.');
            } else {
                logger.error('[useProfile] Erreur critique changement password:', err);
                toast.error('Une erreur technique est survenue');
            }
            return false;
        } finally {
            setChangingPassword(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && isInitialized) {
            fetchProfile();
        } else {
            setProfile(null);
            setStats({ totalOrders: 0, pendingOrders: 0, totalSpent: 0 });
            setLoading(false);
        }
    }, [isAuthenticated, isInitialized, fetchProfile]);

    useEffect(() => {
        if (isAuthenticated && isInitialized) {
            fetchProfile();
        } else if (!isAuthenticated) {
            setProfile(null);
            setStats({ totalOrders: 0, pendingOrders: 0, totalSpent: 0 });
            setLoading(false);
        }
    }, [isAuthenticated, isInitialized, fetchProfile]);

    return {
        profile, stats, loading, updating, changingPassword, error,
        updateProfile, changePassword, refetch: fetchProfile
    };
};