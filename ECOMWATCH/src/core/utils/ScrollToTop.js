import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 0); // Le "0" permet de passer à la fin de la pile d'exécution
        return () => clearTimeout(timer);
    }, [pathname]);;

    return null;
}

export default ScrollToTop