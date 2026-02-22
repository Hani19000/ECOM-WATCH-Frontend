import { useState, useCallback } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { UserEditDrawer } from '../components/UserEditDrawer';
import { ConfirmDialog } from '../../../../../shared/UI/ConfirmDialog';

import AdminTable from '../../shared/AdminTable';
import TableToolbar from '../../shared/TableToolbar';
import { UserTableRow } from '../components/UserTableRow';

const USER_HEADERS = [
    { label: 'Utilisateur', className: 'text-left' },
    { label: 'Rôle', className: 'text-center hidden sm:table-cell' },
    { label: 'Statut', className: 'text-center hidden sm:table-cell' },
    { label: "Date d'inscription", className: 'text-left hidden md:table-cell' },
    { label: <span className="sr-only sm:not-sr-only">Actions</span>, className: 'text-right' }
];

const UsersAdmin = () => {
    const { state, actions } = useAdminUsers();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleOpenEdit = useCallback((user) => {
        setSelectedUser(user);
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
        setTimeout(() => setSelectedUser(null), 300);
    }, []);

    return (
        <div className="max-w-7xl mx-auto relative space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-8 px-2 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">Gestion des Utilisateurs</h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez les accès, les rôles et les profils des membres de la plateforme.</p>
            </div>

            <div className="shadow-sm rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card transition-colors">
                <TableToolbar
                    searchTerm={state.searchQuery}
                    onSearchChange={actions.handleSearchInputChange}
                    searchPlaceholder="Rechercher par nom, email..."
                />

                <AdminTable
                    headers={USER_HEADERS}
                    data={state.usersList}
                    emptyMessage={state.isLoadingData ? "Chargement des utilisateurs..." : "Aucun utilisateur trouvé."}
                    renderRow={(user) => (
                        <UserTableRow
                            key={user.id}
                            user={user}
                            onEdit={handleOpenEdit}
                            onClickDelete={actions.requestUserDeletion}
                        />
                    )}
                />
            </div>

            <UserEditDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                user={selectedUser}
                onSuccess={actions.fetchUsers}
            />

            <ConfirmDialog
                isOpen={!!state.userToDelete}
                onClose={actions.cancelUserDeletion}
                onConfirm={actions.confirmUserDeletion}
                title="Supprimer ce compte ?"
                message="Cette action est irréversible. Toutes les données associées à cet utilisateur seront supprimées."
                confirmText="Oui, supprimer"
            />
        </div>
    );
};

export default UsersAdmin;