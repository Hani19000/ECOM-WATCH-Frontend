import { useUserEditLogic } from '../hooks/useUserEditLogic';
import AdminDrawer from '../../shared/AdminDrawer';
import { Mail, ShieldCheck, Calendar } from 'lucide-react';

export const UserEditDrawer = ({ isOpen, onClose, user, onSuccess }) => {
    const {
        formData,
        isSaving,
        handleChange,
        handleSubmit
    } = useUserEditLogic(user, isOpen, onClose, onSuccess);

    if (!user) return null;

    const drawerFooter = (
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
            <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
                Annuler
            </button>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 text-xs font-bold uppercase tracking-widest text-white dark:text-gray-900 bg-gray-900 dark:bg-white hover:bg-[#ADA996] dark:hover:bg-gray-200 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
        </div>
    );

    return (
        <AdminDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={`${user.firstName} ${user.lastName}`}
            subtitle="Gestion des privilèges et accès"
            footer={drawerFooter}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de profil */}
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 border border-gray-100 dark:border-dark-border transition-colors">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                </div>

                {/* Modification du Rôle */}
                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2 transition-colors">
                        <ShieldCheck className="w-3.5 h-3.5" /> Rôle de l'utilisateur
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-3 sm:py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-dark-border text-gray-900 dark:text-white rounded-lg text-sm focus:bg-white dark:focus:bg-dark-card focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/20 focus:border-gray-300 dark:focus:border-gray-500 outline-none cursor-pointer transition-all truncate"
                    >
                        <option value="USER">Client (USER)</option>
                        <option value="ADMIN">Administrateur (ADMIN)</option>
                        <option value="MANAGER">Gestionnaire (MANAGER)</option>
                    </select>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded-lg leading-relaxed border border-blue-100 dark:border-blue-800/30 transition-colors">
                    <strong>Attention :</strong> Changer le rôle d'un utilisateur modifie immédiatement ses permissions d'accès aux interfaces d'administration.
                </div>
            </form>
        </AdminDrawer>
    );
};