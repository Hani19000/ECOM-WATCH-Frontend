import { useEffect, useState, useCallback } from 'react';
import { useCart } from './useCart';
import { CartBackupService } from '../api/Cartbackup.service';

/**
 * Gère la restauration du panier après un paiement annulé ou échoué.
 *
 * @param {Object}   options
 * @param {boolean}  options.autoRestore - Active la restauration automatique au montage (défaut: true)
 * @param {Function} options.onRestored  - Callback appelé avec les items restaurés
 */
export const useCartRestore = ({ autoRestore = true, onRestored = null } = {}) => {
    const { restoreCart } = useCart();

    const [isRestoring, setIsRestoring] = useState(false);
    const [restoredCount, setRestoredCount] = useState(0);

    // Évalué une seule fois : le backup ne change pas entre deux renders
    const [hasBackup] = useState(() => CartBackupService.hasBackup());

    // Memoïsé pour pouvoir être listé sans risque dans les dépendances useEffect
    const restore = useCallback(() => {
        setIsRestoring(true);
        setRestoredCount(0);

        try {
            const restoredItems = CartBackupService.restore();

            if (!restoredItems?.length) return 0;

            restoreCart(restoredItems);
            setRestoredCount(restoredItems.length);
            onRestored?.(restoredItems);

            return restoredItems.length;
        } catch {
            return 0;
        } finally {
            setIsRestoring(false);
        }
    }, [restoreCart, onRestored]);

    const clearBackup = useCallback(() => {
        CartBackupService.clear();
        setRestoredCount(0);
    }, []);

    // Restauration automatique unique au montage, conditionnée à la présence d'un backup
    useEffect(() => {
        if (autoRestore && hasBackup) {
            restore();
        }
    }, [autoRestore, hasBackup, restore]);

    return { isRestoring, restoredCount, hasBackup, restore, clearBackup };
};