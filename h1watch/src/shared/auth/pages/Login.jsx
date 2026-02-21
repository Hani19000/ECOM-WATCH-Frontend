import AuthForm from "../components/Auth/AuthForm";
import SEOHead from "../../SEO/SEOHead"

const Login = () => {

    <SEOHead
        title="Connexion | ECOM-WATCH"
        description="Connectez-vous à votre espace client ECOM-WATCH."
        canonical="https://ecom-watch-frontend.vercel.app/login"
    />

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <AuthForm mode="login" />
        </div>
    );
};

export default Login;