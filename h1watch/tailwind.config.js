/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Indispensable pour piloter le mode via une classe sur le <html>
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',    // Un bleu nuit très profond
          card: '#1e293b',  // Une nuance plus claire pour les cartes
          border: '#334155'
        }
      }
    },
  },
}