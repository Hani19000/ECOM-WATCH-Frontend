import { useEffect } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { useVariantFormLogic } from '../../hooks/useVariantFormLogic';

const DrawerHeader = ({ onClose }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-white dark:bg-slate-800/50 shrink-0 transition-colors">
        <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Ajouter une variante</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Nouvelle déclinaison (taille, couleur, stock)</p>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
    </div>
);

const InputGroup = ({ label, name, type = "text", value, onChange, placeholder, required = false }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">
            {label} {required && '*'}
        </label>
        <input
            type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder}
            className="w-full px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all"
        />
    </div>
);

export const VariantFormDrawer = ({ isOpen, onClose, productId, onSuccess }) => {
    // Connexion au cerveau (Hook)
    const { formData, imageFile, saving, handleChange, handleImageChange, handleSubmit } = useVariantFormLogic(productId, isOpen, onClose, onSuccess);

    // Bloquer le scroll derrière le tiroir
    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        }
    }, [isOpen]);

    return (
        <>
            {/* Arrière-plan flou */}
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Tiroir */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-dark-card shadow-2xl z-[101] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                <DrawerHeader onClose={onClose} />

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="SKU (Référence)" name="sku" value={formData.sku} onChange={handleChange} required placeholder="REF-002" />
                            <InputGroup label="Prix (€)" name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="0.00" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label="Taille (Boîtier)" name="size" value={formData.size} onChange={handleChange} placeholder="ex: 40mm" />
                            <InputGroup label="Couleur" name="color" value={formData.color} onChange={handleChange} placeholder="ex: Noir" />
                        </div>

                        <InputGroup label="Stock Initial" name="initialStock" type="number" value={formData.initialStock} onChange={handleChange} required />

                        {/* Zone d'upload d'image */}
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">Image de la variante</label>
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-dark-border border-dashed rounded-lg cursor-pointer bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-6 h-6 mb-2 text-gray-400 dark:text-gray-500" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {imageFile ? imageFile.name : "Cliquez pour uploader une image"}
                                    </p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    {/* Footer Responsive */}
                    <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0 transition-colors">
                        <button type="button" onClick={onClose} disabled={saving} className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={saving} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-white dark:text-gray-900 bg-black dark:bg-white hover:bg-[#ADA996] dark:hover:bg-gray-200 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                            {saving ? 'Ajout...' : 'Ajouter la variante'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};