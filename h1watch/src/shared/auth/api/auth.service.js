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
        const { data } = await api.post('/auth/refresh');
        return data.data;
    },

    async logout() {
        await api.post('/auth/logout');
    },

    async getMe() {
        const { data } = await api.get('/auth/me');
        return data.data;
    },

    /*
     * Déclenche l'envoi d'un email de réinitialisation.
     * Le backend ne confirme pas l'existence de l'email pour prévenir les attaques par énumération.
     */
    async forgotPassword(email) {
        const { data } = await api.post('/auth/forgot-password', { email });
        return data;
    },

    /*
     * Valide la modification du mot de passe via un jeton à usage unique.
     */
    async resetPassword(token, newPassword) {
        const { data } = await api.post('/auth/reset-password', { token, newPassword });
        return data;
    }
};