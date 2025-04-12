import { useEffect, useState } from "react";
import { MdOutlineWhatsapp } from "react-icons/md";
import { useCart } from "../cart/useCart";

//const externalUrl = "https://m.me/100010586863647?source=qr_link_share&";

const RequestBtn = () => {
    const { cart } = useCart();

    const buildMessage = () : string => {

        let items : string[] = cart.items.map(item => {
            return "\n - " + item.product.name + ((item.count > 1) ? `, necesito ${item.count}` : '');
        });
        let message = "Hola, quisiera encargar: "
            + items.join(" ");
        ;
        return encodeURIComponent(message);
    }

    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
          document.body.classList.add("body-no-scroll");
        } else {
          document.body.classList.remove("body-no-scroll");
        }
    
        // Cleanup function to remove the class when the component unmounts
        return () => {
          document.body.classList.remove("body-no-scroll");
        };
    }, [isOpen]);
    
    return <>
        <a 
            className="btn btn-primary"
            
            target="_blank"
            onClick={openModal}
        >
            <MdOutlineWhatsapp className='text-xl' /> Encargar
        </a>
        {isOpen && (
        <div
            className="fixed inset-0 flex items-end justify-center z-50 bg-black bg-opacity-50"
            style={{
                transform: "translateX(-8px) scale(1.05)"
            }}
            onClick={closeModal} // Close modal on outside click
        >
            <div
                className="modal-box relative w-full max-w-full rounded-none"
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
            >
                <p className="font-bold text-lg mb-3 text-center">Comunicarme por</p>
                <div className="flex justify-center">
                    <div className="m-3 px-4">
                        <a href={`https://wa.me/50879241?text=${buildMessage()}`} target="_blank">
                            <img src="/app-icons/WhatsApp.png" className="max-h-12"></img>
                            <span className="text-xs">WhatsApp</span>
                        </a>
                    </div>
                    <div className="m-3 px-4">
                        <a href={`https://t.me/ymlee0919?text=${buildMessage()}`} target="_blank">
                            <img src="/app-icons/Telegram.png" className="max-h-12"></img>
                            <span className="text-xs">Telegram</span>
                        </a>
                    </div>
                    <div className="m-3 px-4">
                        <a href={`https://m.me/100010586863647?source=qr_link_share&text=${buildMessage()}`} target="_blank">
                            <img src="/app-icons/Messenger.png" className="max-h-12"></img>
                            <span className="text-xs">Messenger</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>)}
    </>
}

export default RequestBtn;