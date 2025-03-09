import { NavLink } from "react-router-dom";
import { VariantCardInfo } from "../../database/database.types";
import { CommonProps } from "../../types/Common";

export interface VariantCardProps extends CommonProps {
    variant: VariantCardInfo
}

const VariantCard = (props: VariantCardProps) => {
    return <>
        <NavLink to={`/${props.variant.categoryUrl}/${props.variant.productUrl}/v/${props.variant.variantId}`}>
            <div className="shadow-md rounded-sm bg-sky-50 p-2">
                <div className="relative">
                    <div className="aspect-square w-full flex items-center justify-center bg-white">
                        <img src={props.variant.remoteUrl} alt="Product Name" className="h-full w-full object-contain bg-white"></img>
                    </div>
                    <p className="price-label">$ {props.variant.price}</p>
                </div>
                <div className="px-4 py-2">
                    <p className="text-xl text-gray-600">{props.variant.name}</p>
                    <p className="text-gray-400 text-sm">{props.variant.productName}</p>
                </div>
            </div>
        </NavLink>
    </>

}

export default VariantCard;