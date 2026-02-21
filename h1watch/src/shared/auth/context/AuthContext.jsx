import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// On peut importer un spinner propre si disponible
// import { Spinner } from '../../../components/ui/Spinner'; 

export const AuthProvider = ({ children }) => {
    const { checkAuth, isInitialized } = useAuth();

    useEffect(() => {
        // Au montage, on vérifie la session
        checkAuth();
    }, [checkAuth]);

    // TANT QUE l'initialisation n'est pas finie, on bloque le rendu
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    {/* Spinner CSS simple en attendant le composant UI */}
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