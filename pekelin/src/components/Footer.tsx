import { FaMedal } from "react-icons/fa"
import { FaHeartCircleCheck } from "react-icons/fa6"
import { RiShieldCheckFill } from "react-icons/ri"


const Footer = () => {

    return <>
        <div id="footer" className="footer bg-blue-900 text-white px-5">
            <div className=" text-center justify-center">
                <span className="text-3xl">Pekelin</span>
            </div>
            
            <div className="container">
                <p className="footer-item"><span className="footer-icon"><FaHeartCircleCheck/></span> <span className="footer-text">Belleza y confort para su niño</span></p>
                <p className="footer-item"><span className="footer-icon"><FaMedal/></span> <span className="footer-text">Calidad en el producto</span></p>
                <p className="footer-item"><span className="footer-icon"><RiShieldCheckFill/></span> <span className="footer-text">Seriedad y seguridad en el servicio</span></p>
            </div>
            </div>
        
    </>

}

export default Footer