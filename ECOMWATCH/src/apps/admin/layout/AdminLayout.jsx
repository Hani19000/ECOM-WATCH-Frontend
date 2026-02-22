import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

export const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        // bg-[#FAFAF9] -> dark:bg-dark-bg
        <div className="flex h-screen overflow-hidden bg-[#FAFAF9] dark:bg-dark-bg font-sans relative transition-colors duration-200">

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <AdminSidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <AdminNavbar onMenuToggle={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};