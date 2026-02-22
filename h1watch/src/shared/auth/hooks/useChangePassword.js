import { useState } from 'react';
import { useProfile } from '../../user/hooks/useProfile';

export const useChangePassword = () => {
    const { changingPassword, changePassword } = useProfile();

    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
    const [validationErrors, setValidationErrors] = useState({});

    const validateNewPassword = (password) => {
        const errors = {};
        if (!password) return errors;
        if (password.length < 8) errors.length = 'Au moins 8 caractères requis';
        if (!/[A-Z]/.test(password)) errors.uppercase = 'Au moins une majuscule requise';
        if (!/[a-z]/.test(password)) errors.lowercase = 'Au moins une minuscule requise';
        if (!/[0-9]/.test(password)) errors.number = 'Au moins un chiffre requis';
        return errors;
    };

    const getPasswordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        const newErrors = { ...validationErrors };
        delete newErrors[name];

        if (name === 'newPassword') {
            const pwErrors = validateNewPassword(value);
            if (Object.keys(pwErrors).length > 0) newErrors.newPassword = pwErrors;
            else delete newErrors.newPassword;
        }

        if (name === 'confirmPassword' || name === 'newPassword') {
            const compareWith = name === 'confirmPassword' ? formData.newPassword : value;
            const confirmValue = name === 'confirmPassword' ? value : formData.confirmPassword;

            if (confirmValue && confirmValue !== compareWith) newErrors.match = 'Les mots de passe ne correspondent pas';
            else delete newErrors.match;
        }

        if (name === 'newPassword' && value === formData.oldPassword) {
            newErrors.different = "Le nouveau mot de passe doit être différent de l'actuel";
        }

        setValidationErrors(newErrors);
    };

    const togglePassword = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(validationErrors).length > 0) return;
        if (formData.newPassword !== formData.confirmPassword) {
            setValidationErrors({ match: 'Les mots de passe ne correspondent pas' });
            return;
        }

        const success = await changePassword(formData.oldPassword, formData.newPassword);

        if (success) {
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setValidationErrors({});
        }
    };

    const isFormValid = formData.oldPassword && formData.newPassword && formData.confirmPassword && Object.keys(validationErrors).length === 0;

    return {
        formData,
        showPasswords,
        validationErrors,
        isFormValid,
        changingPassword,
        passwordStrength: getPasswordStrength(formData.newPassword),
        handleChange,
        togglePassword,
        onSubmit
    };
};