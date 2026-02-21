/**
 * @module Service/CartBackup
 * * Gère la sauvegarde temporaire du panier avant paiement et sa restauration
 * en cas d'annulation ou d'échec de paiement.
 * * Architecture : Service Layer Pattern
 */

const BACKUP_KEY = 'cart_backup_v1';
const BACKUP_EXPIRY_HOURS = 24; // Le backup expire après 24h

export const CartBackupService = {
    /**
     * Sauvegarde le panier actuel dans le localStorage.
     * * @param {Array} cartItems - Les items du panier à sauvegarder
     * @returns {boolean} true si succès
     */
    backup: (cartItems) => {
        try {
            if (!cartItems || cartItems.length === 0) {
                return false;
            }

            const backupData = {
                items: cartItems,
                timestamp: Date.now(),
            };

            localStorage.setItem(BACKUP_KEY, JSON.stringify(backupData));
            return true;
        } catch {
            // Échec silencieux (ex: quota localStorage atteint)
            return false;
        }
    },

    /**
     * Restaure le panier depuis le backup si celui-ci est valide.
     * * @returns {Array|null} Les items restaurés ou null si pas de backup valide
     */
    restore: () => {
        try {
            const backupData = localStorage.getItem(BACKUP_KEY);

            if (!backupData) {
                return null;
            }

            const parsed = JSON.parse(backupData);

            // Vérification de l'expiration
            if (!CartBackupService.isValid(parsed.timestamp)) {
                CartBackupService.clear();
                return null;
            }
            return parsed.items;

        } catch {
            CartBackupService.clear(); // Nettoyage en cas de corruption des données
            return null;
        }
    },

    /**
     * Supprime le backup (appelé après paiement réussi).
     */
    clear: () => {
        try {
            localStorage.removeItem(BACKUP_KEY);
        } catch {
            // Erreur ignorée pour rester silencieux
        }
    },

    /**
     * Vérifie si un backup valide existe.
     * * @returns {boolean}
     */
    hasBackup: () => {
        try {
            const backupData = localStorage.getItem(BACKUP_KEY);
            if (!backupData) return false;

            const parsed = JSON.parse(backupData);
            return CartBackupService.isValid(parsed.timestamp);
        } catch {
            return false;
        }
    },

    /**
     * Vérifie si le timestamp d'un backup est encore valide.
     * * @param {number} timestamp - Timestamp du backup
     * @returns {boolean}
     * @private
     */
    isValid: (timestamp) => {
        if (!timestamp) return false;

        const now = Date.now();
        const expiryTime = BACKUP_EXPIRY_HOURS * 60 * 60 * 1000;
        const age = now - timestamp;

        return age < expiryTime;
    },

    /**
     * Récupère les informations du backup.
     * * @returns {Object|null} { itemCount, createdAt, isExpired }
     */
    getInfo: () => {
        try {
            const backupData = localStorage.getItem(BACKUP_KEY);
            if (!backupData) return null;

            const parsed = JSON.parse(backupData);
            const isExpired = !CartBackupService.isValid(parsed.timestamp);

            return {
                itemCount: parsed.items?.length || 0,
                createdAt: new Date(parsed.timestamp),
                isExpired,
            };
        } catch {
            return null;
        }
    }
};