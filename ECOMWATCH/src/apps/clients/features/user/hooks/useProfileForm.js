import { useState, useMemo } from 'react';

/**
 * Hook de logique pour le formulaire de profil.
 * Utilise le pattern "Render-Phase Update" pour éviter les renders en cascade.
 */
export const useProfileForm = (profile, onSubmit) => {
    const [prevProfile, setPrevProfile] = useState(profile);

    const [formData, setFormData] = useState({
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        phone: profile?.phone || '',
    });

    if (profile !== prevProfile) {
        setPrevProfile(profile);
        setFormData({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            phone: profile?.phone || '',
        });
    }

    const hasChanges = useMemo(() => {
        if (!profile) return false;
        return (
            formData.firstName !== (profile.firstName || '') ||
            formData.lastName !== (profile.lastName || '') ||
            formData.phone !== (profile.phone || '')
        );
    }, [formData, profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        // CORRECTION ICI : On envoie la totalité du formulaire à chaque fois.
        // Cela empêche le backend de remplacer les champs non modifiés par "null".
        onSubmit({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
        });
    };

    const handleReset = () => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
            });
        }
    };

    return {
        formData,
        hasChanges,
        handleChange,
        handleSubmit,
        handleReset
    };
};