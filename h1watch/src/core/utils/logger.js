import { env } from '../config/env';

/**
 * Logger centralisé pour l'application.
 * En production, les logs de niveau 'debug' et 'info' sont supprimés pour la performance et la sécurité.
 */
const logger = {
    info: (...args) => {
        if (env.IS_DEVELOPMENT) {
            console.info('[INFO]', ...args);
        }
    },
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },
    debug: (...args) => {
        if (env.IS_DEVELOPMENT) {
            console.debug('[DEBUG]', ...args);
        }
    }
};

export default logger;