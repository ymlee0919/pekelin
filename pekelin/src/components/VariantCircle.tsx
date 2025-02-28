import { NavLink } from "react-router-dom";
import { VariantCardInfo } from "../database/database.types";
import { CommonProps } from "../types/Common";

export interface VariantCircleProps extends CommonProps {
    variant: VariantCardInfo
}

const VariantCircle = (props: VariantCircleProps) => {
    return <>
        <NavLink to={`/${props.variant.categoryUrl}/${props.variant.productUrl}/v/${props.variant.variantId}`} className="pb-3">
            <div className="shadow-md rounded-full bg-sky-100 p-1">
                <div className="aspect-square w-full flex items-center justify-center">
                    <img src={props.variant.remoteUrl} alt="Product Name" className="rounded-full h-full w-full object-contain bg-white p-1"></img>
                </div>
            </div>
            <p className="text-center text-gray-500 text-xs px-2">{props.variant.name}</p>
        </NavLink>
    </>

}

export default VariantCircle;