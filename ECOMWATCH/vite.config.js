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
 * • Render-blocking CSS :
 *   `cssCodeSplit: true` extrait le CSS propre à chaque chunk dans un fichier
 *   séparé, réduisant le CSS bloquant au strict minimum pour chaque route.
 *
 * • Assets réseau superflus :
 *   `assetsInlineLimit` internalise en base64 les fichiers < 4 KiB,
 *   supprimant les requêtes HTTP pour les petites icônes et images.
 *
 * ⚠️  Erreur évitée — dépendances circulaires dans manualChunks :
 *   Un catch-all `return 'vendor-misc'` pour tous les node_modules peut provoquer
 *   une erreur "Cannot access 'X' before initialization" au runtime si deux modules
 *   du même chunk se référencent mutuellement (dépendance circulaire).
 *   Solution : ne splitter que les dépendances bien isolées (React, Router, Stripe…)
 *   et laisser Rollup gérer automatiquement le reste.
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
     * Chaque chunk JS importe uniquement son propre fichier CSS.
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
         * Stratégie : isoler uniquement les dépendances bien délimitées
         * et stables dans des chunks dédiés pour maximiser le cache
         * navigateur long terme.
         *
         * Chaque chunk reçoit un hash content-based dans son nom
         * (ex: vendor-react-BcXYZ.js). Le navigateur ne re-télécharge
         * un chunk que si son contenu a réellement changé.
         *
         * ⚠️  Pas de catch-all sur node_modules :
         * Regrouper toutes les dépendances inconnues dans un même chunk
         * "vendor-misc" peut créer des dépendances circulaires entre modules
         * qui ne se connaissent pas, causant des erreurs d'initialisation
         * au runtime. Rollup gère mieux ce cas automatiquement.
         *
         * Chunks définis :
         * • vendor-react  → React + ReactDOM : très stables, bénéficient
         *                   d'un cache long terme (rarement mis à jour)
         * • vendor-router → React Router : versionné indépendamment de React
         * • vendor-stripe → Lourd (~50 KiB), chargé uniquement sur les pages
         *                   de paiement — ne doit pas alourdir la homepage
         * • vendor-ui     → Libs d'animation/notification chargées sur toutes
         *                   les pages, isolées pour leur propre cycle de cache
         */
        manualChunks(id) {
          // React core — chunk le plus stable, cache maximal
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }

          // React Router — séparé de React pour des mises à jour indépendantes
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }

          // Stripe — chargé uniquement sur les pages de paiement
          if (id.includes('node_modules/@stripe') || id.includes('node_modules/stripe')) {
            return 'vendor-stripe';
          }

          // Librairies UI légères mais présentes sur toutes les pages
          if (
            id.includes('node_modules/framer-motion') ||
            id.includes('node_modules/react-hot-toast') ||
            id.includes('node_modules/lucide-react')
          ) {
            return 'vendor-ui';
          }

          // Toutes les autres dépendances sont laissées à Rollup.
          // Rollup les répartit intelligemment selon le graphe d'imports,
          // évitant ainsi les dépendances circulaires inter-chunks.
        },
      },
    },
  },

  /**
   * Pre-bundling des dépendances critiques (dev uniquement)
   * Évite les waterfalls de requêtes lors du premier chargement en développement.
   * Sans effet sur le build de production.
   */
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});