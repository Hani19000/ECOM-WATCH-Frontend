const AuthHeader = ({ title, subtitle }) => (
    <div className="text-center mb-10">
        <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-gray-900">
            {title}<span className="text-[#ADA996]">.</span>
        </h2>
        <p className="text-gray-400 text-xs mt-3 uppercase tracking-widest font-bold">
            {subtitle}
        </p>
    </div>
);

export default AuthHeader;