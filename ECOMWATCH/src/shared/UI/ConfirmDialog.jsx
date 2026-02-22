import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Êtes-vous sûr ?",
    message = "Cette action est irréversible.",
    confirmText = "Supprimer",
    cancelText = "Annuler",
    isDangerous = true // Si true, le bouton sera rouge
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative z-[201] animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full shrink-0 ${isDangerous ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h3>
                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{message}</p>
                        </div>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors shrink-0">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors ${isDangerous ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-gray-800'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};