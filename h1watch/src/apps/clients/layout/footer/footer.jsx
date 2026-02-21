import { Link } from "react-router-dom";
import { FOOTER_NAV, FOOTER_LEGAL, PAYMENT_METHODS } from "./Footer.constants";

// Colonne de liens avec titre de section
const FooterNavColumn = ({ title, links }) => (
    <div className="flex flex-col gap-5">
        <h4 className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#ADA996]">
            {title}
        </h4>
        <nav className="flex flex-col gap-3">
            {links.map(({ label, to }) => (
                <Link
                    key={label}
                    to={to}
                    // Les liens étaient corrects, mais on s'assure qu'ils restent bien lisibles
                    className="text-[11px] text-gray-400 uppercase tracking-[0.18em] font-light
                               hover:text-white transition-colors duration-300"
                >
                    {label}
                </Link>
            ))}
        </nav>
    </div>
);

// Séparateur décoratif cohérent avec le style du site
const Divider = () => (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#ADA996]/20 to-transparent" />
);

const Footer = () => (
    <footer className="mt-24 bg-[#1A1A19] text-white">

        {/* Bandeau de réassurance */}
        <div className="border-b border-[#ADA996]/10">
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { icon: '✦', label: 'Authenticité Certifiée' },
                    { icon: '◈', label: 'Livraison Sécurisée' },
                    { icon: '◇', label: 'Garantie 2 Ans' },
                ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center justify-center gap-3">
                        <span className="text-[#ADA996] text-sm">{icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        {/* Corps principal */}
        <div className="max-w-7xl mx-auto px-8 pt-16 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

                <div className="md:col-span-4 flex flex-col gap-7">
                    <Link to="/" className="flex flex-col gap-2 group w-fit">
                        <span className="text-xl font-light tracking-[0.45em] text-white
                                         group-hover:text-[#ADA996] transition-colors duration-500">
                            ECOM<span className="text-[#ADA996]">-</span>WATCH.
                        </span>
                        <div className="h-px w-8 bg-[#ADA996]/50 group-hover:w-full transition-all duration-500" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-[#ADA996]/90 mt-0.5">
                            Manufacture de Prestige
                        </span>
                    </Link>

                    <p className="text-[10px] leading-relaxed text-gray-400 uppercase tracking-[0.15em] font-light max-w-64">
                        L'art de la haute horlogerie — chaque pièce, une œuvre d'exception.
                    </p>

                    {/* Localisation */}
                    <p className="text-[9px] text-[#ADA996]/80 tracking-[0.3em] uppercase font-medium">
                        Geneva · Paris · London
                    </p>
                </div>

                {/* Colonnes de navigation */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10">
                    {FOOTER_NAV.map((column) => (
                        <FooterNavColumn key={column.title} {...column} />
                    ))}
                </div>
            </div>

            {/* Pied de page */}
            <div className="mt-12 pt-8">
                <Divider />
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Liens légaux */}
                    <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                        {FOOTER_LEGAL.map(({ label, to }) => (
                            <Link
                                key={label}
                                to={to}
                                className="text-[9px] text-gray-400 uppercase tracking-[0.2em]
                                           hover:text-[#ADA996] transition-colors duration-300"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>

                    {/* Moyens de paiement */}
                    <div className="flex items-center gap-5">
                        <span className="text-[8px] text-gray-400 uppercase tracking-widest hidden sm:block">
                            Paiement sécurisé
                        </span>
                        {PAYMENT_METHODS.map((method) => (
                            <span
                                key={method}
                                className="text-[9px] font-bold text-gray-400 uppercase tracking-wider
                                           border border-gray-500 px-2 py-1"
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="mt-6 text-center text-[9px] text-gray-500 uppercase tracking-[0.3em]">
                    © {new Date().getFullYear()} Ecom-Watch. Tous droits réservés.
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;