import Menu from '@/components/generic/Menu';
import { type ReactNode } from 'react';
import Footer from '@/components/generic/Footer';
import { Head, usePage } from '@inertiajs/react';
import { ReactTagManager } from 'react-gtm-ts';
import ReactGA from "react-ga4";

interface StoreFrontLayoutProps {
    children: ReactNode;
}


export default ({ children }: StoreFrontLayoutProps) => {
    const { gtm_id, gafour_id } = usePage().props;

    if(gtm_id) {
        ReactTagManager.init({
            code: gtm_id, // GTM Code
            debug: false, // debug mode (default false)
            performance: false, // starts GTM only after user interaction (improve initial page load)
        });
    }
    if(gafour_id) {
        ReactGA.initialize(gafour_id);
    }

    return (<>
        <Menu />
        {children}
        <Footer />
    </>);
};
