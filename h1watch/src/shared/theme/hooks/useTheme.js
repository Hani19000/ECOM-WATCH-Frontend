import { useState, useEffect } from 'react';

export const useTheme = () => {
    // On initialise avec la préférence du localStorage ou par défaut en 'light'
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // On retire l'ancien thème et on ajoute le nouveau sur la balise <html>
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // On sauvegarde le choix
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
};