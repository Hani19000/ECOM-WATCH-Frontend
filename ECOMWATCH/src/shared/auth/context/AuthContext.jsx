import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Responsabilité unique : lancer le check de session en arrière-plan au montage.
 *
 * - useRef(false) garantit que checkAuth n'est appelé qu'une seule fois,
 *   même en React StrictMode qui monte les composants deux fois en dev.
 * - Aucun écran de chargement global ici.
 * - L'app s'affiche immédiatement grâce au session hint (localStorage Zustand).
 * - checkAuth confirme ou invalide ce hint silencieusement.
 * - Les guards (GuestGuard, RoleGuard) gèrent leur propre état via isInitialized.
 */
export const AuthProvider = ({ children }) => {
    const { checkAuth } = useAuth();
    const hasChecked = useRef(false); // ← Garde contre le double appel (StrictMode)

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;
        checkAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Rendu immédiat — aucun blocage
    return children;
};