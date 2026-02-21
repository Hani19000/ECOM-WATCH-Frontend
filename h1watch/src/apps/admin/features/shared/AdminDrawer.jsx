import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdminDrawer = ({ isOpen, onClose, title, subtitle, headerContent, children, footer }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAnimated, setIsAnimated] = useState(false);

    if (isOpen && !shouldRender) {
        setShouldRender(true);
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const raf = requestAnimationFrame(() => setIsAnimated(true));
            return () => cancelAnimationFrame(raf);
        } else {
            document.body.style.overflow = 'unset';
            const raf = requestAnimationFrame(() => setIsAnimated(false));
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => {
                cancelAnimationFrame(raf);
                clearTimeout(timer);
            };
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${isAnimated ? 'visible' : 'invisible'}`}>
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            <div
                className={`relative w-full max-w-md bg-white dark:bg-dark-card h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isAnimated ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-slate-800/50 shrink-0 transition-colors">
                    <div className="pr-4">
                        <h2 className="text-lg font-serif text-gray-900 dark:text-white leading-tight">
                            {title}
                        </h2>
                        {subtitle && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 font-medium">{subtitle}</p>}
                        {headerContent}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Corps scrollable */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-gray-900 dark:text-white">
                    {children}
                </div>

                {/* Pied de page */}
                {footer && (
                    <div className="p-6 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-slate-800/50 shrink-0 transition-colors">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDrawer;