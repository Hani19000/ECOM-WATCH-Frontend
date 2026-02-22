/**
 * @module Service/Auth (Frontend)
 *
 * Gère les appels API liés à l'authentification.
 * Service Layer Pattern : pas de logique React ici, pas d'état.
 */
import { api } from '../../../api/axios.config';

export const authService = {
    async login(credentials) {
        const { data } = await api.post('/auth/login', credentials);
        return data.data;
    },

    async register(userData) {
        const { data } = await api.post('/auth/register', userData);
        return data.data;
    },

    async refresh() {
        const response = await api.post('/auth/refresh');
        return response.data.data;
    },

    async logout() {
        await api.post('/auth/logout');
    },

    async getMe() {
        const { data } = await api.get('/auth/me');
        return data.data;
    },

    /**
     * Envoie un email de réinitialisation si l'email est associé à un compte.
     * Le backend répond identiquement qu'un compte existe ou non.
     *
     * @param {string} email - Email de l'utilisateur
     */
    async forgotPassword(email) {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
    },

    /**
     * Consomme le token de reset et met à jour le mot de passe.
     *
     * @param {string} token       - Token brut extrait de l'URL du lien email
     * @param {string} newPassword - Nouveau mot de passe choisi par l'utilisateur
     */
    async resetPassword(token, newPassword) {
        const { data } = await api.post('/auth/reset-password', { token, newPassword });
        return data;
    },
};