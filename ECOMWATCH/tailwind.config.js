/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155'
        }
      },
      keyframes: {
        // Animation de la barre de chargement de l'AuthLoadingScreen.
        // Slide de gauche à droite pour signaler une attente active sans durée connue.
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      animation: {
        loading: 'loading 1.4s ease-in-out infinite',
      },
    },
  },
};