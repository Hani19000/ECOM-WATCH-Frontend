import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

/*
 * Bloque le rendu de l'arbre applicatif tant que l'état de la session n'est pas validé.
 * Prévient les scintillements (flickering) et l'exécution prématurée des guards de routage.
 */
export const AuthProvider = ({ children }) => {
    const { checkAuth, isInitialized } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                        Chargement H1Watch...
                    </span>
                </div>
            </div>
        );
    }

    return children;
};