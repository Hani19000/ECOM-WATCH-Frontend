import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Session Hint Pattern.
 *
 * Seuls les champs d'affichage (prénom, rôles) sont persistés — jamais un token.
 * Cela permet à l'app de s'afficher instantanément dès le prochain chargement,
 * sans attendre la réponse du serveur. Le vrai check d'authentification
 * (checkAuth) confirme ou invalide ce hint en arrière-plan.
 *
 * Sécurité : si le serveur invalide la session, le hint est effacé
 * et l'utilisateur est déconnecté silencieusement.
 */
const SESSION_HINT_KEY = 'sw_session_hint';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            // isInitialized passe à true uniquement après que le check
            // serveur (checkAuth) a confirmé ou infirmé la session.
            // Les guards s'appuient sur ce flag pour leurs redirections définitives.
            isInitialized: false,

            setInitialized: (value) => set({ isInitialized: value }),

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isInitialized: true,
            }),

            logout: () => set({
                user: null,
                isAuthenticated: false,
                isInitialized: true,
            }),
        }),
        {
            name: SESSION_HINT_KEY,

            // On ne persiste QUE les données d'affichage, jamais les tokens.
            // Le hint sert uniquement à pré-rendre l'UI correctement.
            partialize: (state) => ({
                user: state.user
                    ? {
                        id: state.user.id,
                        firstName: state.user.firstName,
                        roles: state.user.roles,
                    }
                    : null,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);