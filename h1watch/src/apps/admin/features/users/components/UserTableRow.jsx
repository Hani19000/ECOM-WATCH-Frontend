import { ShieldAlert, Trash2 } from 'lucide-react';

export const UserTableRow = ({ user, onEdit, onClickDelete }) => {
    if (!user) return null;

    const isAdministrator = user.roles?.some(roleName => roleName.toUpperCase() === 'ADMIN');
    const displayRole = isAdministrator ? 'Admin' : 'Client';
    const isBlocked = user.isActive === false;

    const formattedDate = new Date(user.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const userInitials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';

    return (
        <tr className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-gray-100 dark:border-dark-border">
            <td className="py-3 sm:py-4 px-3 sm:px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs font-bold shrink-0 transition-colors">
                        {userInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:hidden">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isAdministrator ? 'text-purple-700 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                {displayRole}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                            <span className={`text-[10px] font-bold ${isBlocked ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                {isBlocked ? 'Bloqué' : 'Actif'}
                            </span>
                        </div>
                    </div>
                </div>
            </td>

            <td className="py-3 sm:py-4 px-4 text-center hidden sm:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${isAdministrator ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                    {displayRole}
                </span>
            </td>
            <td className="py-3 sm:py-4 px-4 text-center hidden sm:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${isBlocked ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
                    {isBlocked ? 'Bloqué' : 'Actif'}
                </span>
            </td>
            <td className="py-3 sm:py-4 px-4 text-sm text-gray-500 dark:text-gray-400 font-medium hidden md:table-cell">
                {formattedDate}
            </td>

            <td className="py-3 sm:py-4 pl-2 pr-4 sm:px-4 text-right">
                {!isAdministrator ? (
                    <div className="flex items-center justify-end sm:gap-1">
                        <button
                            type="button"
                            onClick={() => onEdit(user)}
                            title="Gérer le compte"
                            className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors focus:ring-2 focus:ring-blue-500/50 outline-none"
                        >
                            <ShieldAlert className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onClickDelete(user.id)}
                            title="Supprimer le compte"
                            className="p-2 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:ring-2 focus:ring-red-500/50 outline-none"
                        >
                            <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-dark-border text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest rounded-md cursor-not-allowed transition-colors">
                        Protégé
                    </span>
                )}
            </td>
        </tr>
    );
};