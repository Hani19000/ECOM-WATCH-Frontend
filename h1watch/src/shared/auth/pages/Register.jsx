import AuthForm from "../components/Auth/AuthForm";
import SEOHead from "../../SEO/SEOHead"

const Register = () => {

    <SEOHead
        title="Créer un compte | ECOM-WATCH"
        description="Créez votre compte ECOM-WATCH pour accéder à votre historique de commandes et profiter d'une expérience personnalisée."
        canonical="https://ecom-watch-frontend.vercel.app/register"
    />

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full flex justify-center">
                <AuthForm mode="register" />
            </div>
        </div>
    );
};

export default Register;