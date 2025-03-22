import { FaMedal } from "react-icons/fa"
import { FaHeartCircleCheck } from "react-icons/fa6"
import { RiShieldCheckFill } from "react-icons/ri"


const Footer = () => {

    return <>
        <div id="footer" className="footer bg-blue-900 text-white">
            <div className="flex flex-wrap w-full gap-0 xl:flex-row-reverse">
                <div className="xl:w-2/12 w-full text-center">
                    <div className="inline-flex align-middle">
                        <img src="/icon-white.png" className="max-h-28"></img>
                    </div>
                </div>
                <div className="xl:w-10/12 w-full justify-center text-center">
                    <div className="flex flex-wrap w-full mb-7 gap-0">
                        <div className="w-full text-center pb-12">
                            <span className="text-3xl">Pekelín</span>
                            <p>
                                Vista a su niña como una princesa y a su niño como un caballero.
                            </p>
                        </div>
                        <div className="xl:w-4/12 w-full">
                            <p className="footer-item"><span className="footer-icon"><FaHeartCircleCheck/></span> <span className="footer-text">Belleza y confort para su niño</span></p>
                        </div>

                        <div className="xl:w-4/12 w-full">
                            <p className="footer-item"><span className="footer-icon"><FaMedal/></span> <span className="footer-text">Calidad en el producto</span></p>
                        </div>

                        <div className="xl:w-4/12 w-full">
                            <p className="footer-item"><span className="footer-icon"><RiShieldCheckFill/></span> <span className="footer-text">Seriedad y seguridad en el servicio</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="py-3 bg-blue-950 text-sky-300 text-center text-xs">
            <span className="px-3">Desarrollado por Yuriesky Méndez</span>(+53) 54 881372<span></span>
        </div>
        
    </>

}

export default Footer