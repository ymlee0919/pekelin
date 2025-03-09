import { Outlet } from 'react-router-dom';
import Navbar from '../components/main/Navbar';
import Footer from '../components/main/Footer';
import ScrollToTop from "../components/ScrollToTop";

const Layout = () => {

    return <>
        <ScrollToTop />
        <Navbar />
        <div>
            <Outlet />    
        </div>
        <Footer />
    </>

}

export default Layout