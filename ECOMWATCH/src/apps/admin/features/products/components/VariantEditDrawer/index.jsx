import { X } from 'lucide-react';
import { useVariantEditLogic } from '../../hooks/useVariantEditLogic';

const InputGroup = ({ label, name, type = "text", value, onChange, placeholder, required = false }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">
            {label} {required && '*'}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all"
        />
    </div>
);

export const VariantEditDrawer = ({ isOpen, onClose, variant, onSuccess }) => {
    const { formData, saving, handleChange, handleSubmit } = useVariantEditLogic(variant, isOpen, onClose, onSuccess);

    return (
        <>
            {/* Backdrop avec animation classique */}
            {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] transition-opacity" onClick={onClose} />}

            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white dark:bg-dark-card shadow-2xl z-[110] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* En-tête */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-white dark:bg-slate-800/50 shrink-0 transition-colors">
                    <div>
                        <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white tracking-tight">Modifier Variante</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{variant?.sku}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
                        <InputGroup label="SKU (Référence)" name="sku" value={formData.sku} onChange={handleChange} required />
                        <InputGroup label="Prix (€)" name="price" type="number" value={formData.price} onChange={handleChange} required />

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Taille" name="size" value={formData.size} onChange={handleChange} />
                            <InputGroup label="Couleur" name="color" value={formData.color} onChange={handleChange} />
                        </div>

                        {/* Note d'information (couleurs adoucies pour le dark mode) */}
                        <div className="p-3 sm:p-4 mt-6 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs rounded-lg border border-yellow-200 dark:border-yellow-800/30 leading-relaxed transition-colors">
                            <strong>Note :</strong> Le stock ne se modifie pas ici. Il faut utiliser le module "Inventaire" pour les entrées/sorties de stock.
                        </div>
                    </div>

                    {/* Footer Responsive */}
                    <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-dark-border flex flex-col sm:flex-row items-center justify-end gap-3 bg-gray-50 dark:bg-slate-800/50 shrink-0 transition-colors">
                        <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-3 sm:py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg uppercase transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs font-bold text-white dark:text-gray-900 bg-black dark:bg-white hover:bg-[#ADA996] dark:hover:bg-gray-200 rounded-lg uppercase transition-colors disabled:opacity-50">
                            {saving ? 'Sauvegarde...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};