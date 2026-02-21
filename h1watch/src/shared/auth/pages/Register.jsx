import AuthForm from "../components/Auth/AuthForm";

const Register = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            {/* On peut passer une prop className si on veut élargir le conteneur pour le Register qui a plus de champs */}
            <div className="w-full flex justify-center">
                {/* Le AuthForm s'adapte tout seul */}
                <AuthForm mode="register" />
            </div>
        </div>
    );
};

export default Register;