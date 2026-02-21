import { useCategoryFormLogic } from '../../hooks/useCategoryFormLogic';
import AdminDrawer from '../../../shared/AdminDrawer';

const InputField = ({ labelText, inputName, inputValue, onChangeHandler, isRequired = false }) => (
    <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">
            {labelText} {isRequired && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
        <input
            type="text"
            name={inputName}
            value={inputValue || ''}
            onChange={onChangeHandler}
            required={isRequired}
            className="w-full px-3 py-3 sm:py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border rounded-lg text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-300 dark:focus:border-gray-500 outline-none transition-all"
        />
    </div>
);

export const CategoryFormDrawer = ({ isDrawerOpen, onCloseDrawer, initialCategoryData, onSuccessCallback }) => {
    const isCreationMode = !initialCategoryData;
    const { categoryFormData, isSavingInProgress, handleInputCategoryChange, submitCategoryForm } = useCategoryFormLogic(
        initialCategoryData,
        isDrawerOpen,
        onCloseDrawer,
        onSuccessCallback
    );

    const drawerFooter = (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <button
                type="button"
                onClick={onCloseDrawer}
                disabled={isSavingInProgress}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                Annuler
            </button>
            <button
                type="button"
                onClick={submitCategoryForm}
                disabled={isSavingInProgress}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-white dark:text-gray-900 bg-gray-900 dark:bg-white hover:bg-[#ADA996] dark:hover:bg-gray-200 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
                {isSavingInProgress ? 'Sauvegarde...' : 'Confirmer'}
            </button>
        </div>
    );

    return (
        <AdminDrawer
            isOpen={isDrawerOpen}
            onClose={onCloseDrawer}
            title={isCreationMode ? 'Nouvelle Catégorie' : 'Éditer la catégorie'}
            subtitle="Organisation de la taxonomie du catalogue"
            footer={drawerFooter}
        >
            <form onSubmit={submitCategoryForm} className="space-y-6 sm:space-y-8 mt-2">
                <InputField
                    labelText="Nom de la catégorie"
                    inputName="name"
                    inputValue={categoryFormData.name}
                    onChangeHandler={handleInputCategoryChange}
                    isRequired
                />

                <InputField
                    labelText="Identifiant URL (Slug)"
                    inputName="slug"
                    inputValue={categoryFormData.slug}
                    onChangeHandler={handleInputCategoryChange}
                    isRequired
                />

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-xs leading-relaxed rounded-lg border border-yellow-200 dark:border-yellow-800/30 transition-colors">
                    <strong>Note :</strong> Le slug détermine l'URL (ex: /catalogue/<strong>{categoryFormData.slug || 'nom'}</strong>). Ne le modifiez pas si la catégorie est déjà indexée sur les moteurs de recherche.
                </div>
            </form>
        </AdminDrawer>
    );
};