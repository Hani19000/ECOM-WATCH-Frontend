/**
 * Configuration centralisée de l'environnement.
 * Permet de valider et typer les variables d'environnement.
 */
export const env = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
    CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'https://ecomwatch.vercel.app',
    IS_PRODUCTION: import.meta.env.PROD,
    IS_DEVELOPMENT: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
};