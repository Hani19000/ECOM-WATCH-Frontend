import axios from 'axios';

/**
 * @module API/Config
 * 
 * Configuration centralisée d'Axios avec sécurité renforcée.
 * 
 * ARCHITECTURE DE SÉCURITÉ :
 * - Access Token : Stocké en MÉMOIRE (variable de module privée)
 * - Refresh Token : Cookie HttpOnly (géré par le navigateur)
 * 
 * Pourquoi cette approche est sécurisée :
 * - Le token en mémoire est inaccessible depuis la console ou via XSS
 * - Le cookie HttpOnly ne peut pas être lu par JavaScript
 * - Les tokens sont perdus au refresh de page (sécurité > UX)
 * - Le refresh token permet de restaurer la session automatiquement
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Variable de module privée (Closure JavaScript).
 * 
 * Pourquoi c'est sécurisé :
 * - Inaccessible depuis window.localStorage (pas de XSS)
 * - Inaccessible depuis la console DevTools
 * - Scope limité à ce module uniquement
 * - Perdu au refresh de page (force un nouveau refresh token)
 */
let _accessToken = null;

/**
 * Définit le token en mémoire.
 * Appelé après login ou refresh réussi.
 * 
 * @param {string|null} token - Le nouveau token JWT
 */
export const setAccessToken = (token) => {
    _accessToken = token;
};

/**
 * Récupère le token actuel (utile pour debugging ou tests).
 * 
 * @returns {string|null}
 */
export const getAccessToken = () => _accessToken;

/**
 * Nettoie le token en mémoire (logout).
 */
export const clearAccessToken = () => {
    _accessToken = null;
};

/**
 * Instance Axios configurée.
 * 
 * withCredentials: true
 * Pourquoi : Permet d'envoyer ET recevoir les cookies HttpOnly
 * - Le navigateur envoie automatiquement le cookie refreshToken
 * - Le serveur peut définir de nouveaux cookies (refresh, etc.)
 */
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // CRUCIAL pour les cookies HttpOnly
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Intercepteur de requête : Injection automatique du token.
 * 
 * Comportement :
 * - Si token présent → Ajoute le header Authorization
 * - Si token absent → Continue sans header (mode guest)
 * 
 * Pourquoi ne pas vérifier l'expiration ici :
 * - L'intercepteur de réponse gère le refresh automatique
 * - Simplicité : un seul point de gestion du refresh
 * - Le backend est la source de vérité pour la validité du token
 */
api.interceptors.request.use(
    (config) => {
        if (_accessToken) {
            config.headers.Authorization = `Bearer ${_accessToken}`;
        }
        // Si pas de token : mode guest (routes avec optionalAuth)
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Intercepteur de réponse : Gestion du refresh automatique.
 * 
 * LOGIQUE CRITIQUE :
 * 
 * 1. Erreur 401 + Token présent = Token expiré
 *    → Tenter un refresh automatique
 *    → Retry la requête originale avec le nouveau token
 * 
 * 2. Erreur 401 + Pas de token = Mode guest
 *    → Propager l'erreur (ne pas tenter de refresh)
 *    → Le composant gère l'erreur (toast, redirection, etc.)
 * 
 * 3. Erreur 401 sur /auth/refresh = Refresh token invalide
 *    → Propager l'erreur (éviter la boucle infinie)
 *    → Logout complet nécessaire
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        /**
         * Détection de la route de refresh.
         * Pourquoi : Éviter une boucle infinie si le refresh échoue
         */
        const isRefreshRequest = originalRequest.url?.includes('/auth/refresh');

        /**
         * CONDITIONS POUR TENTER UN REFRESH :
         * 
         * 1. Erreur 401 (Unauthorized)
         * 2. Pas déjà tenté un refresh (éviter boucle)
         * 3. Pas une requête de refresh elle-même
         * 4. On a un token en mémoire (sinon c'est un guest)
         * 
         * Pourquoi la condition _accessToken est critique :
         * - Guest checkout : Pas de token → 401 → Propagation directe
         * - User connecté : Token présent → 401 → Tentative refresh
         * - User déconnecté : Pas de token → 401 → Propagation directe
         */
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isRefreshRequest &&
            _accessToken // ← CONDITION CRITIQUE AJOUTÉE
        ) {
            originalRequest._retry = true;

            try {
                /**
                 * Appel de l'endpoint de refresh.
                 * 
                 * Le refreshToken est envoyé automatiquement via le cookie HttpOnly.
                 * Le serveur vérifie sa validité et renvoie un nouveau accessToken.
                 */
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {}, // Body vide
                    {
                        withCredentials: true // Important pour envoyer le cookie
                    }
                );

                const newAccessToken = response.data?.data?.accessToken;

                if (newAccessToken) {
                    // Mise à jour du token en mémoire
                    setAccessToken(newAccessToken);

                    // Mise à jour du header de la requête originale
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    /**
                     * Retry de la requête originale avec le nouveau token.
                     * 
                     * Exemple :
                     * 1. User fait POST /orders/checkout → 401 (token expiré)
                     * 2. Refresh automatique → Nouveau token
                     * 3. Retry POST /orders/checkout → Succès
                     */
                    return api(originalRequest);
                }
            } catch (refreshError) {
                /**
                 * Le refresh a échoué.
                 * 
                 * Causes possibles :
                 * - Refresh token expiré
                 * - Refresh token révoqué
                 * - Serveur indisponible
                 * 
                 * Action : Nettoyer le token et propager l'erreur.
                 * Le composant décide quoi faire (redirection login, etc.)
                 */
                clearAccessToken();

                /**
                 * NE PAS rediriger ici !
                 * 
                 * Pourquoi :
                 * - axios.config.js est un module technique
                 * - La redirection est une décision métier
                 * - Laisse le composant gérer (ProtectedRoute, useAuth, etc..)
                 */

                return Promise.reject(refreshError);
            }
        }

        /**
         * Pour toutes les autres erreurs :
         * - 400, 403, 404, 409, 500, etc.
         * - 401 sans token (mode guest)
         * - 401 déjà retry
         * 
         * → Propager l'erreur au composant appelant
         */
        return Promise.reject(error);
    }
);

export default api;