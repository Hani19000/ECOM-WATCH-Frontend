import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { authService } from '../api/auth.service';
import { forgotPasswordSchema } from '../schemas/auth.schema';
import logger from '../../../core/utils/logger';

export const useForgotPasswordForm = () => {
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
            setIsSubmitted(true);
        } catch (error) {
            /*
             * L'affichage de la confirmation est forcé même en cas d'erreur 404.
             * Prévient le scan de la base de données (énumération d'emails).
             */
            if (!error.response || error.response.status >= 500) {
                logger.error('[ForgotPasswordForm]', error);
                toast.error('Une erreur est survenue. Veuillez réessayer.');
            } else {
                setIsSubmitted(true);
            }
        }
    };

    return {
        register,
        onSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        isSubmitted
    };
};