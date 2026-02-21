import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ProductTablePagination = ({ page, totalPages, onPageChange }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card rounded-b-xl transition-colors">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Page {page} sur {totalPages || 1}
        </p>
        <div className="flex gap-1">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-md border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-md border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);