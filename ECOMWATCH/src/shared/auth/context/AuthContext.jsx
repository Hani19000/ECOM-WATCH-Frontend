import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Responsabilité unique : lancer le check de session en arrière-plan au montage.
 *
 * Il n'y a plus d'écran de chargement global ici.
 * L'app s'affiche immédiatement grâce au session hint (localStorage).
 * checkAuth confirme ou invalide ce hint silencieusement.
 *
 * Les routes protégées gèrent leur propre état d'attente via les guards.
 */
export const AuthProvider = ({ children }) => {
    const { checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Rendu immédiat — aucun blocage
    return children;
};