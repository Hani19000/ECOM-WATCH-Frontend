/**
 * @module Service/CartBackup
 * * Isole la logique de sauvegarde pré-paiement.
 * Permet la récupération du panier si la session Stripe échoue ou est annulée.
 */
const BACKUP_KEY = 'cart_backup_v1';
const BACKUP_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 heures

export const CartBackupService = {
    backup: (cartItems) => {
        if (!cartItems?.length) return false;

        try {
            const backupData = { items: cartItems, timestamp: Date.now() };
            localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
            return true;
        } catch {
            return false;
        }
    },

    restore: () => {
        try {
            const backupData = localStorage.getItem(BACKUP_KEY);
            if (!backupData) return null;

            const parsed = JSON.parse(backupData);

            if (!CartBackupService.isValid(parsed.timestamp)) {
                CartBackupService.clear();
                return null;
            }
            return parsed.items;
        } catch {
            CartBackupService.clear();
            return null;
        }
    },

    clear: () => {
        try {
            localStorage.removeItem(BACKUP_KEY);
        } catch {
            // Fail-safe silencieux
        }
    },

    hasBackup: () => {
        try {
            const backupData = localStorage.getItem(BACKUP_KEY);
            if (!backupData) return false;

            return CartBackupService.isValid(JSON.parse(backupData).timestamp);
        } catch {
            return false;
        }
    },

    isValid: (timestamp) => {
        if (!timestamp) return false;
        return (Date.now() - timestamp) < BACKUP_EXPIRY_MS;
    }
};