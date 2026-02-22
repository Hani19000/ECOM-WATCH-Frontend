import { Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuthForm'
import AuthHeader from '../../components/Auth/AuthHeader'
import AuthInput from '../../components/Auth/AuthInput';
import AuthActions from '../../components/Auth/AuthActions';
import AuthFooter from '../../components/Auth/AuthFooter';

const AuthForm = ({ mode = 'login' }) => {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
        config,
        isLogin
    } = useAuth(mode);

    return (
        <div className="w-full max-w-md bg-white rounded-4xl shadow-xl shadow-gray-100/50 border border-gray-100 p-8 md:p-12">

            <AuthHeader
                title={config.title}
                subtitle={config.subtitle}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {!isLogin && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AuthInput
                            label="Prénom"
                            name="firstName"
                            placeholder="John"
                            register={register}
                            error={errors.firstName}
                        />
                        <AuthInput
                            label="Nom"
                            name="lastName"
                            placeholder="Doe"
                            register={register}
                            error={errors.lastName}
                        />
                    </div>
                )}

                <AuthInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    icon={<Mail />}
                    register={register}
                    error={errors.email}
                />

                <div className="relative">
                    <AuthInput
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="******"
                        icon={<Lock />}
                        register={register}
                        error={errors.password}
                    />

                    {isLogin && (
                        <div className="text-right mt-2 mr-1">
                            <Link
                                to="/forgot-password"
                                className="text-[10px] uppercase font-black tracking-widest text-gray-400 hover:text-[#ADA996] transition-colors"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    )}
                </div>

                {!isLogin && (
                    <AuthInput
                        label="Confirmation"
                        name="confirmPassword"
                        type="password"
                        placeholder="******"
                        icon={<Lock />}
                        register={register}
                        error={errors.confirmPassword}
                    />
                )}

                <AuthActions
                    isSubmitting={isSubmitting}
                    label={config.submitLabel}
                    loadingLabel={config.loadingLabel}
                />

            </form>

            <AuthFooter
                text={config.bottomText}
                linkText={config.bottomLinkText}
                linkUrl={config.bottomLinkUrl}
            />
        </div>
    );
};

export default AuthForm;