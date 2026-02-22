import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { authService } from '../api/auth.service';
import { resetPasswordSchema } from '../schemas/auth.schema';
import logger from '../../../core/utils/logger';

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
            const errorMessage = error.response?.data?.message || 'Une erreur est survenue. Veuillez recommencer.';
            toast.error(errorMessage, { duration: 5000 });

            if (!error.response || error.response.status >= 500) {
                logger.error('[ResetPasswordForm]', error);
            }
        }
    };

    return {
        register,
        onSubmit: handleSubmit(onSubmit),
        errors,
        isSubmitting,
        hasToken: !!token
    };
};