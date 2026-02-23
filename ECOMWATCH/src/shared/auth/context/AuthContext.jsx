import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../hooks/useAuthStore';

// Durée max accordée au serveur pour répondre au refresh.
// Si le backend ne répond pas (cold start Render, réseau…), on débloque quand même l'app.
const AUTH_INIT_TIMEOUT_MS = 6000;

export const AuthProvider = ({ children }) => {
    const { checkAuth } = useAuth();
    const { isInitialized, setInitialized } = useAuthStore();
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Filet de sécurité : si checkAuth ne résout pas dans le délai imparti,
        // on débloque l'app en mode "non connecté" plutôt que de rester bloqué indéfiniment.
        timeoutRef.current = setTimeout(() => {
            setInitialized(true);
        }, AUTH_INIT_TIMEOUT_MS);

        checkAuth().finally(() => {
            clearTimeout(timeoutRef.current);
        });

        return () => clearTimeout(timeoutRef.current);
    }, [checkAuth, setInitialized]);

    if (!isInitialized) {
        return <AuthLoadingScreen />;
    }

    return children;
};

function AuthLoadingScreen() {
    return (
        <div
            role="status"
            aria-label="Chargement de l'application"
            className="min-h-screen flex items-center justify-center bg-white"
        >
            <div className="flex flex-col items-center gap-6">
                {/* Logo — identique visuellement à la navbar pour éviter le flash de layout */}
                <span className="text-xl font-light tracking-[0.3em] text-gray-900 uppercase select-none">
                    Ecom<span className="font-semibold">Watch</span>
                </span>

                {/* Barre indéterminée — CSS pur, zéro dépendance, zéro JS */}
                <div className="w-32 h-px bg-gray-100 overflow-hidden rounded-full">
                    <div className="h-full bg-gray-900 rounded-full animate-[loading_1.4s_ease-in-out_infinite]" />
                </div>
            </div>
        </div>
    );
}