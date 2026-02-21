import { Link } from "react-router-dom";

const Footer = () => {
    return (
        /* Utilisation d'un gris chaud profond au lieu du noir pur */
        <footer className="mt-24 bg-[#1A1A19] text-white border-t border-[#ADA996]/10">
            <div className="max-w-7xl mx-auto px-8 pt-20 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">

                    {/* Colonne Signature */}
                    <div className="md:col-span-5 flex flex-col gap-8 items-center md:items-start">
                        <Link to="/" className="flex flex-col gap-1 group">
                            <span className="text-2xl font-light tracking-[0.4em] text-white transition-colors duration-500 group-hover:text-[#ADA996]">
                                ECOM-WATCH.
                            </span>
                            <div className="h-px w-12 bg-[#ADA996]/40 transition-all duration-500 group-hover:w-full" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#ADA996]/60 mt-1">
                                Manufacture de Prestige
                            </span>
                        </Link>
                        <p className="text-[11px] leading-relaxed text-gray-400 uppercase tracking-[0.15em] max-w-75 font-light">
                            L'art de la haute horlogerie, où chaque seconde est une pièce d'exception.
                        </p>
                    </div>

                    {/* Liens - Style Épuré */}
                    <div className="md:col-span-2 flex flex-col gap-7">
                        <h4 className="text-[10px] font-bold text-[#ADA996] uppercase tracking-[0.3em]">La Maison</h4>
                        <nav className="flex flex-col gap-4 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                            <Link to="/" className="hover:text-white transition-colors duration-300">Collection</Link>
                            <Link to="/" className="hover:text-white transition-colors duration-300">Héritage</Link>
                            <Link to="/" className="hover:text-white transition-colors duration-300">Boutiques</Link>
                        </nav>
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-7">
                        <h4 className="text-[10px] font-bold text-[#ADA996] uppercase tracking-[0.3em]">Clientèle</h4>
                        <nav className="flex flex-col gap-4 text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                            <Link to="/" className="hover:text-white transition-colors duration-300">Entretien</Link>
                            <Link to="/" className="hover:text-white transition-colors duration-300">Expédition</Link>
                            <Link to="/" className="hover:text-white transition-colors duration-300">Garantie</Link>
                        </nav>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8 text-[9px] text-gray-500 uppercase tracking-[0.2em] font-medium">
                        <Link to="/" className="hover:text-[#ADA996] transition-colors">Confidentialité</Link>
                        <Link to="/" className="hover:text-[#ADA996] transition-colors">Cookies</Link>
                    </div>

                    <div className="text-[9px] text-gray-600 tracking-[0.4em] uppercase font-light">
                        Geneva — Paris — London
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;