import { Link } from 'react-router-dom';

const AuthFooter = ({ text, linkText, linkUrl }) => (
    <p className="text-center mt-8 text-xs text-gray-400 font-medium">
        {text}
        <Link to={linkUrl} className="text-gray-900 font-black uppercase ml-2 hover:text-[#ADA996] transition-colors">
            {linkText}
        </Link>
    </p>
);

export default AuthFooter;