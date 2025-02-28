import { BsMessenger } from "react-icons/bs";
import { CommonProps } from "../types/Common";

export interface RequestBtnProps extends CommonProps {
    gender: string;
    product: string;
}

const externalUrl = "https://m.me/100010586863647?source=qr_link_share&";

const RequestBtn = (props: RequestBtnProps) => {
    
    let message = `Hola, quisiera encargar ${props.gender == "M" ? 'una' : 'un'} ${props.product.toLowerCase()}. Déjeme saber cómo podemos hacer.`;
    let url = externalUrl + "text=" + encodeURIComponent(message);

    return <>
        <a 
            className="btn btn-info"
            href={url}
            target="_blank"
        >
            <BsMessenger /> Encargar
        </a>
    </>
}

export default RequestBtn;