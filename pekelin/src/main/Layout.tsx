import { Outlet } from 'react-router-dom';
import Navbar from '../components/main/Navbar';
import Footer from '../components/main/Footer';
import ScrollToTop from "../components/ScrollToTop";
import { Toaster } from 'react-hot-toast';

const Layout = () => {

    return <>
        <Toaster />
        <ScrollToTop />
        <Navbar />
        <div>
            <Outlet />    
        </div>
        <Footer />
    </>

}

export default Layout