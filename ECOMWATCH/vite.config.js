/**
 * @file vite.config.js
 *
 * Configuration Vite optimisée pour la performance Lighthouse.
 *
 * Problèmes adressés :
 * ─────────────────────────────────────────────────────────────────────────────
 * • Unused JavaScript (−101 KiB estimés) :
 *   `manualChunks` divise le bundle en chunks indépendants par domaine fonctionnel.
 *   Le navigateur ne charge que le chunk nécessaire à la route active.
 *
 * • Render-blocking CSS (−40 ms estimés) :
 *   `cssCodeSplit: true` (actif par défaut dans Vite) extrait le CSS propre
 *   à chaque chunk dans un fichier séparé, réduisant le CSS bloquant au minimum.
 *
 * • Assets réseaux superflus :
 *   `assetsInlineLimit` internalise en base64 les fichiers < 4 KiB,
 *   supprimant les requêtes HTTP pour les petites icônes et images.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    /**
     * CSS Code Splitting (défaut Vite : true)
     * Chaque chunk JS importe son propre fichier CSS.
     * Le CSS de la homepage n'est pas chargé sur le catalogue et inversement.
     */
    cssCodeSplit: true,

    /**
     * Inline des petits assets
     * Les fichiers < 4 KiB sont encodés en base64 et inlinés dans le JS/CSS,
     * supprimant des requêtes HTTP inutiles pour les petites ressources.
     */
    assetsInlineLimit: 4096,

    rollupOptions: {
      output: {
        /**
         * Code Splitting Manuel
         * ─────────────────────────────────────────────────────────────
         * Stratégie : isoler les dépendances stables dans des chunks
         * dédiés pour maximiser le cache navigateur long terme.
         *
         * Chaque chunk reçoit un hash content-based dans son nom
         * (ex: vendor-react-BcXYZ.js). Le navigateur ne re-télécharge
         * un chunk que si son contenu a changé.
         *
         * • vendor-react  → React + ReactDOM : très stables, cache maximal
         * • vendor-router → React Router : mis à jour indépendamment de React
         * • vendor-stripe → Lourd (~50 KiB), uniquement sur les pages de paiement
         * • vendor-ui     → Libs d'animation et de notifications UI
         * • vendor-misc   → Toutes les autres dépendances node_modules
         */
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/@stripe') || id.includes('node_modules/stripe')) {
            return 'vendor-stripe';
          }
          if (
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/react-hot-toast') ||
            id.includes('node_modules/lucide-react')
          ) {
            return 'vendor-ui';
          }
          if (id.includes('node_modules/')) {
            return 'vendor-misc';
          }
          // Le code applicatif est automatiquement splité par Vite par route
        },
      },
    },
  },

  /**
   * Pre-bundling des dépendances critiques (dev + preview)
   * Évite les waterfalls de requêtes lors du premier chargement en développement.
   */
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});