import { Outlet } from 'react-router-dom';
import Navbar from './navbar/NavBar';
import Footer from './footer/footer';
import CartDrawer from '../../../apps/clients/features/cart/components/CartDrawer/index';
import ScrollToTop from '../../../core/utils/ScrollToTop';

export const AppLayout = () => {
    return (

        <div
            className="min-h-screen flex flex-col"
            style={{
                background: 'linear-gradient(135deg, #ADA996 0%, #F2F2F2 100%)',
                backgroundAttachment: 'fixed'
            }}
        >
            <ScrollToTop />
            <div className="mx-auto w-full p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
                <Navbar />

                <main className="grow py-8">
                    <Outlet />
                </main>
                <CartDrawer />
                <Footer />
            </div>
        </div>
    );
};