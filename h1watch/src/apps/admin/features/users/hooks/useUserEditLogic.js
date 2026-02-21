import { useState, useEffect, useCallback } from 'react';
import { AdminUserService } from '../api/adminUser.service';
import toast from 'react-hot-toast';

/**
 * Noms des exports alignés avec ce que UserEditDrawer consomme :
 * formData, isSaving, handleChange, handleSubmit.
 */
export const useUserEditLogic = (initialUserData, isDrawerOpen, onCloseDrawer, onSuccessCallback) => {
    const [formData, setFormData] = useState({ role: 'USER', isActive: 'true' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isDrawerOpen && initialUserData) {
            const hasAdminRole = initialUserData.roles?.some(
                roleName => roleName.toUpperCase() === 'ADMIN'
            );
            setFormData({
                role: hasAdminRole ? 'ADMIN' : 'USER',
                isActive: initialUserData.isActive === false ? 'false' : 'true'
            });
        }
    }, [initialUserData, isDrawerOpen]);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(previousState => ({ ...previousState, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (event) => {
        event?.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                role: formData.role,
                isActive: formData.isActive === 'true'
            };
            await AdminUserService.update(initialUserData.id, payload);
            toast.success('Privilèges mis à jour avec succès.');
            onSuccessCallback();
            onCloseDrawer();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour.');
        } finally {
            setIsSaving(false);
        }
    }, [formData, initialUserData, onCloseDrawer, onSuccessCallback]);

    return { formData, isSaving, handleChange, handleSubmit };
};