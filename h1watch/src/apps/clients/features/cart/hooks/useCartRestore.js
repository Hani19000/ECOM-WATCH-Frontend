import { useEffect, useState } from 'react';
import { useCart } from './useCart';
import { CartBackupService } from '../api/Cartbackup.service';

/**
 * Hook de restauration automatique du panier après annulation de paiement.
 * 
 * Architecture : Custom Hook Pattern
 * - S'exécute automatiquement au montage du composant
 * - Détecte la présence d'un backup
 * - Restaure le panier si nécessaire
 * - Gère les états de restauration pour l'UI
 * 
 * Utilisation :
 * ```jsx
 * const { isRestoring, restoredCount } = useCartRestore();
 * 
 * if (isRestoring) return <Loader />;
 * if (restoredCount > 0) return <Message>Panier restauré</Message>;
 * ```
 * 
 * @param {Object} options - Configuration
 * @param {boolean} options.autoRestore - Active la restauration auto (défaut: true)
 * @param {Function} options.onRestored - Callback après restauration
 * @returns {Object} { isRestoring, restoredCount, hasBackup, restore, clearBackup }
 */
export const useCartRestore = ({
    autoRestore = true,
    onRestored = null
} = {}) => {
    const { restoreCart } = useCart();

    const [isRestoring, setIsRestoring] = useState(false);
    const [restoredCount, setRestoredCount] = useState(0);
    const [hasBackup] = useState(() => CartBackupService.hasBackup());

    /**
     * Restaure le panier depuis le backup.
     * 
     * SIMPLE ET PROPRE : Utilise restoreCart pour remplacer tout le panier
     * 
     * @returns {number} Nombre d'articles restaurés
     */
    const restore = () => {
        setIsRestoring(true);
        setRestoredCount(0);

        try {
            const restoredItems = CartBackupService.restore();

            if (restoredItems && restoredItems.length > 0) {
                // Restauration via la fonction exposée du provider
                restoreCart(restoredItems);
                setRestoredCount(restoredItems.length);

                // Callback optionnel
                if (onRestored) {
                    onRestored(restoredItems);
                }

                return restoredItems.length;
            }

            return 0;

        } catch {
            return 0;

        } finally {
            setIsRestoring(false);
        }
    };

    /**
     * Supprime le backup sans restaurer.
     * Utile si l'utilisateur veut repartir à zéro.
     */
    const clearBackup = () => {
        CartBackupService.clear();
        setRestoredCount(0);
    };

    // ================================================================
    // Restauration automatique au montage du composant
    // ================================================================
    useEffect(() => {
        if (autoRestore && hasBackup) {
            restore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Exécution unique au montage

    return {
        isRestoring,
        restoredCount,
        hasBackup,
        restore,
        clearBackup,
    };
};