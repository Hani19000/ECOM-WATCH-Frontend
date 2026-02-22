/**
 * @module Hook/useResetPasswordForm
 *
 * Gère la logique du formulaire de réinitialisation de mot de passe.
 * Récupère le token depuis les paramètres de l'URL et l'envoie au service.
 *
 * Service Layer Pattern : aucune logique métier ici, appel au service uniquement.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authService } from '../api/auth.service';
import { resetPasswordSchema } from '../schemas/auth.schema';
import logger from '../../../core/utils/logger';

/**
 * @returns {{
 *   register: Function,
 *   handleSubmit: Function,
 *   errors: Object,
 *   isSubmitting: boolean,
 *   hasToken: boolean,
 *   onSubmit: Function,
 * }}
 */
export const useResetPasswordForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async ({ newPassword }) => {
        if (!token) {
            toast.error('Lien de réinitialisation invalide ou manquant.');
            return;
        }

        try {
            await authService.resetPassword(token, newPassword);
            toast.success('Mot de passe mis à jour. Veuillez vous reconnecter.');
            navigate('/login', { replace: true });
        } catch (error) {
            const backendMessage = error.response?.data?.message;
            const fallbackMessage = 'Une erreur est survenue. Veuillez recommencer.';
            toast.error(backendMessage || fallbackMessage, { duration: 5000 });

            if (!error.response || error.response.status >= 500) {
                logger.error('[ResetPasswordForm] error:', error);
            }
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        // Permet à l'UI d'afficher un message d'erreur si le token est absent de l'URL
        hasToken: Boolean(token),
        onSubmit,
    };
};