import { useState } from 'react';
import { useProfile } from '../../user/hooks/useProfile'; // Nous créerons ce fichier juste après ou on utilise l'existant

/**
 * Hook personnalisé gérant toute la logique du changement de mot de passe.
 * Isole la complexité (Validation, Strength, API) de la vue.
 */
export const useChangePassword = () => {
    // On utilise le hook de profil (qui sera dans features/user)
    const { changingPassword, changePassword } = useProfile();

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [validationErrors, setValidationErrors] = useState({});

    // --- Fonctions Utilitaires Pures (Validation & Force) ---

    const validateNewPassword = (password) => {
        const errors = {};
        if (!password) return errors;
        if (password.length < 8) errors.length = 'Au moins 8 caractères requis';
        if (!/[A-Z]/.test(password)) errors.uppercase = 'Au moins une majuscule requise';
        if (!/[a-z]/.test(password)) errors.lowercase = 'Au moins une minuscule requise';
        if (!/[0-9]/.test(password)) errors.number = 'Au moins un chiffre requis';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.special = 'Au moins un caractère spécial';
        return errors;
    };

    const getPasswordStrength = (password) => {
        if (!password) return { label: '', color: 'bg-gray-200', percentage: 0 };

        let criteriaMet = 0;
        if (password.length >= 8) criteriaMet++;
        if (/[A-Z]/.test(password)) criteriaMet++;
        if (/[a-z]/.test(password)) criteriaMet++;
        if (/[0-9]/.test(password)) criteriaMet++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) criteriaMet++;

        const percentage = criteriaMet * 20;

        if (percentage <= 40) return { label: 'Faible', color: 'bg-red-500', percentage };
        if (percentage <= 60) return { label: 'Moyen', color: 'bg-yellow-500', percentage };
        if (percentage <= 80) return { label: 'Bon', color: 'bg-blue-500', percentage };
        return { label: 'Excellent', color: 'bg-green-500', percentage };
    };

    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);

        let newErrors = {};

        // Validation dynamique
        const complexErrors = validateNewPassword(newFormData.newPassword);
        newErrors = { ...complexErrors };

        if (newFormData.confirmPassword && newFormData.newPassword !== newFormData.confirmPassword) {
            newErrors.match = 'Les mots de passe ne correspondent pas';
        }

        if (newFormData.oldPassword && newFormData.newPassword && newFormData.oldPassword === newFormData.newPassword) {
            newErrors.same = "Le nouveau mot de passe doit être différent de l'actuel";
        }

        setValidationErrors(newErrors);
    };

    const togglePassword = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Sécurité ultime avant envoi
        if (Object.keys(validationErrors).length > 0) return;
        if (formData.newPassword !== formData.confirmPassword) {
            setValidationErrors({ match: 'Les mots de passe ne correspondent pas' });
            return;
        }

        const success = await changePassword(formData.oldPassword, formData.newPassword);

        if (success) {
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setValidationErrors({});
        }
    };

    // --- Données Dérivées ---

    const passwordStrength = getPasswordStrength(formData.newPassword);

    const isFormValid =
        formData.oldPassword &&
        formData.newPassword &&
        formData.confirmPassword &&
        Object.keys(validationErrors).length === 0;

    return {
        formData,
        showPasswords,
        validationErrors,
        isFormValid,
        changingPassword,
        passwordStrength,
        handleChange,
        handleSubmit,
        togglePassword
    };
};