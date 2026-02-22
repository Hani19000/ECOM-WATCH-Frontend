import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from './useAuth';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import logger from '../../../core/utils/logger';

export const useAuthForm = (mode = 'login') => {
    const isLogin = mode === 'login';
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register: registerUser } = useAuth();

    const config = {
        title: isLogin ? 'Connexion' : 'Rejoindre',
        subtitle: isLogin ? 'Accédez à votre collection' : 'Créez votre profil ECOM-WATCH',
        submitLabel: isLogin ? 'Se connecter' : 'Créer mon compte',
        loadingLabel: isLogin ? 'Authentification...' : 'Création du compte...',
        redirectUrl: isLogin ? (location.state?.from?.pathname || '/') : '/login',
        successMessage: isLogin ? 'Bon retour parmi nous' : 'Compte créé avec succès',
        bottomText: isLogin ? 'Pas encore de compte ?' : 'Déjà membre ?',
        bottomLinkText: isLogin ? "S'inscrire" : 'Se connecter',
        bottomLinkUrl: isLogin ? '/register' : '/login'
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(isLogin ? loginSchema : registerSchema),
    });

    const onSubmit = async (data) => {
        try {
            if (isLogin) {
                await login(data);
            } else {
                const { confirmPassword: _confirmPassword, ...payload } = data;
                await registerUser(payload);
            }

            toast.success(config.successMessage);
            navigate(config.redirectUrl, { replace: true });
        } catch (error) {
            // OPTIMISATION UX/UI : Extraction propre du message d'erreur du Backend
            // Si l'erreur provient du backend (AxiosError), on extrait le message prévu.
            // Sinon, on affiche un message d'erreur générique.
            const backendMessage = error.response?.data?.message;
            const fallbackMessage = `Erreur lors de ${isLogin ? "la connexion" : "l'inscription"}`;
            const displayMessage = backendMessage || fallbackMessage;

            // On affiche le message proprement à l'utilisateur (ex: "Ce compte a été suspendu.")
            toast.error(displayMessage, {
                duration: 5000, // On laisse le message affiché un peu plus longtemps pour qu'il ait le temps de le lire
            });

            // On ne loggue l'erreur dans la console QUE s'il s'agit d'une vraie erreur serveur (500)
            // Les erreurs 401/403 (identifiants invalides, compte bloqué) sont des erreurs "métier" normales.
            if (!error.response || error.response.status >= 500) {
                logger.error(`[AuthForm] ${mode} error:`, error);
            }
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        config,
        isLogin
    };
};