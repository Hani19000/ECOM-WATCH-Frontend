/**
 * @module Hook/useForgotPasswordForm
 *
 * Gère la logique du formulaire de demande de réinitialisation de mot de passe.
 * Service Layer Pattern : aucune logique métier ici, appel au service uniquement.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '../api/auth.service';
import { forgotPasswordSchema } from '../schemas/auth.schema';
import logger from '../../../core/utils/logger';

/**
 * @returns {{
 *   register: Function,
 *   handleSubmit: Function,
 *   errors: Object,
 *   isSubmitting: boolean,
 *   isSubmitted: boolean,
 *   onSubmit: Function,
 * }}
 */
export const useForgotPasswordForm = () => {
    // État local pour afficher un écran de confirmation après soumission
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async ({ email }) => {
        try {
            await authService.forgotPassword(email);
            // On passe en mode confirmation quel que soit le résultat backend
            // (le backend répond identiquement si l'email existe ou non)
            setIsSubmitted(true);
        } catch (error) {
            // Seules les erreurs serveur (5xx) ou réseau sont remontées à l'utilisateur
            if (!error.response || error.response.status >= 500) {
                logger.error('[ForgotPasswordForm] error:', error);
                toast.error('Une erreur est survenue. Veuillez réessayer.');
            } else {
                // Erreurs 4xx : on affiche quand même la confirmation pour ne pas
                // révéler l'existence d'un compte (cohérence anti-énumération)
                setIsSubmitted(true);
            }
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        isSubmitted,
        onSubmit,
    };
};