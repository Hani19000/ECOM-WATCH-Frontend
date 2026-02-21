import { useAuthStore } from "../../../shared/auth/hooks/useAuthStore";
import { LogOut, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from "../../../shared/theme/hooks/useTheme";

export const AdminNavbar = ({ onMenuToggle }) => {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme } = useTheme();

    return (
        // bg-white -> dark:bg-dark-card | border-gray-200 -> dark:border-dark-border
        <header className="h-16 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0 transition-colors duration-200">

            <div className="flex items-center md:hidden">
                <button
                    onClick={onMenuToggle}
                    className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900 dark:focus:ring-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                {/* BOUTON THEME */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
                >
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-dark-border mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        {/* text-gray-900 -> dark:text-white */}
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.firstName || 'Admin'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Super Admin</p>
                    </div>
                    {/* Le cercle d'avatar s'inverse : fond noir/texte blanc -> fond blanc/texte noir */}
                    <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-xs font-bold uppercase shrink-0 ring-2 ring-white dark:ring-dark-card shadow-sm transition-colors">
                        {(user?.firstName?.[0] || 'A')}
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="ml-1 sm:ml-2 p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};