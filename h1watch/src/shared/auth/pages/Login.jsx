import AuthForm from "../components/Auth/AuthForm";

const Login = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <AuthForm mode="login" />
        </div>
    );
};

export default Login;