import api from "../../../../../api/axios.config";
import logger from "../../../../../core/utils/logger";

/**
 * Service de gestion des données utilisateur.
 */
export const userService = {
    /**
     * Récupère le profil complet de l'utilisateur connecté.
     * Endpoint: /users/me
     */
    async getProfile() {
        try {
            const { data } = await api.get('/users/me');
            return data.data; // Retourne { user: { ... } }
        } catch (error) {
            // On ne loggue pas les 401 ici car c'est géré par l'intercepteur Axios
            if (error.response?.status !== 401) {
                logger.error('[UserService] Fetch profile failed:', error);
            }
            throw error;
        }
    },

    /**
     * Met à jour les informations partielles du profil.
     * @param {Object} updates - { firstName, lastName, phone, ... }
     */
    async updateProfile(updates) {
        try {
            const { data } = await api.patch('/users/me', updates);
            return data.data;
        } catch (error) {
            logger.error('[UserService] Update profile failed:', error);
            throw error;
        }
    },

    /**
     * Met à jour le mot de passe.
     * @param {string} oldPassword 
     * @param {string} newPassword 
     */
    async updatePassword(oldPassword, newPassword) {
        try {
            await api.patch('/users/update-password', {
                oldPassword,
                newPassword
            });
            return true;
        } catch (error) {
            logger.warn('[UserService] Password update failed:', error.message);
            throw error;
        }
    }
};