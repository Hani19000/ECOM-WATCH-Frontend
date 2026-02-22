import { Edit2 } from 'lucide-react';
import { useProductFormLogic } from '../../hooks/useProductFormLogic';
import AdminDrawer from '../../../shared/AdminDrawer';

const SectionTitle = ({ title }) => (
    <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-dark-border pb-2 mb-4 transition-colors">
        {title}
    </h3>
);

// UX: py-2.5 pour une meilleure préhension tactile + Classes Dark Mode
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

const ProductInfoSection = ({ formData, handleChange, categories }) => (
    <div className="space-y-4">
        <SectionTitle title="Informations Générales (Produit)" />
        <InputGroup label="Nom du produit" name="name" value={formData.name} onChange={handleChange} required />
        <InputGroup label="Slug (URL)" name="slug" value={formData.slug} onChange={handleChange} required />

        {/* Responsive Grid : 1 colonne sur mobile, 2 sur desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">Catégorie</label>
                <select
                    name="categoryIds"
                    value={formData.categoryIds}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all"
                >
                    <option value="">Sélectionner...</option>
                    {Array.isArray(categories) && categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">Statut</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 transition-all"
                >
                    <option value="DRAFT">Brouillon (Caché)</option>
                    <option value="ACTIVE">Actif (Visible)</option>
                    <option value="ARCHIVED">Archivé</option>
                </select>
            </div>
        </div>

        <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">Description</label>
            <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2.5 sm:py-2 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-dark-card focus:border-gray-300 dark:focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 resize-none transition-all"
            />
        </div>
    </div>
);

const InitialVariantSection = ({ formData, handleChange, handleImageChange, imageFile }) => (
    <div className="space-y-4 mt-8 bg-gray-50/50 dark:bg-slate-800/30 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-dark-border transition-colors">
        <SectionTitle title="Première Variante (Générée automatiquement)" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="SKU (Référence)" name="sku" value={formData.sku} onChange={handleChange} required />
            <InputGroup label="Prix (€)" name="price" type="number" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputGroup label="Taille" name="size" value={formData.size} onChange={handleChange} />
            <InputGroup label="Couleur" name="color" value={formData.color} onChange={handleChange} />
        </div>
        <InputGroup label="Stock Initial" name="initialStock" type="number" value={formData.initialStock} onChange={handleChange} required />
        <div>
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5 transition-colors">Image Principale</label>
            <label className={`flex flex-col items-center justify-center w-full h-24 sm:h-28 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageFile
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                    : 'border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-slate-800/50'
                }`}>
                <span className="text-xs text-center px-4 truncate w-full">
                    {imageFile ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex flex-col items-center gap-1">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {imageFile.name}
                        </span>
                    ) : (
                        <span className="text-gray-500 dark:text-gray-400">Ajouter une image</span>
                    )}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
        </div>
    </div>
);

const VariantsListSection = ({ variants, onEditVariant }) => (
    <div className="space-y-4 mt-8">
        <SectionTitle title="Variantes existantes (Prix, Tailles, Couleurs)" />
        <div className="space-y-2">
            {variants.map(variant => (
                <div key={variant.id} className="flex items-center justify-between p-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-sm transition-colors">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{variant.sku}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{variant.price} € - Taille: {variant.attributes?.size || '-'}</span>
                    </div>
                    <button type="button" onClick={() => onEditVariant(variant)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors outline-none focus:ring-2 focus:ring-blue-500/50">
                        <Edit2 className="w-5 h-5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            ))}
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center mt-3 px-4">Fermez ce tiroir et utilisez le bouton (+) du tableau pour ajouter une variante.</p>
    </div>
);

export const ProductFormDrawer = ({ isOpen, onClose, productId, onSuccess, onOpenVariantEdit }) => {
    const isNew = productId === 'new';
    const { categories, variants, formData, imageFile, loading, saving, handleChange, handleImageChange, handleSubmit } = useProductFormLogic(productId, isOpen, onClose, onSuccess);

    const drawerFooter = (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <button type="button" onClick={onClose} disabled={saving} className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                Annuler
            </button>
            <button type="button" onClick={handleSubmit} disabled={saving} className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs font-bold uppercase text-white dark:text-gray-900 bg-black dark:bg-white hover:bg-[#ADA996] dark:hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
        </div>
    );

    return (
        <AdminDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={isNew ? 'Nouveau Produit' : 'Éditer le produit'}
            subtitle="Configuration du catalogue et inventaire"
            footer={drawerFooter}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {loading ? (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-gray-200 dark:border-dark-border border-t-gray-900 dark:border-t-white rounded-full animate-spin transition-colors" />
                    </div>
                ) : (
                    <>
                        <ProductInfoSection formData={formData} handleChange={handleChange} categories={categories} />
                        {isNew ? (
                            <InitialVariantSection formData={formData} handleChange={handleChange} handleImageChange={handleImageChange} imageFile={imageFile} />
                        ) : (
                            <VariantsListSection variants={variants} onEditVariant={onOpenVariantEdit} />
                        )}
                    </>
                )}
            </form>
        </AdminDrawer>
    );
};