import { NavLink } from "react-router-dom";
import { VariantCardInfo } from "../database/database.types";
import { CommonProps } from "../types/Common";
import { MdStar } from "react-icons/md";

export interface VariantCircleProps extends CommonProps {
    variant: VariantCardInfo
}

const VariantCircle = (props: VariantCircleProps) => {
    return <>
        <NavLink to={`/${props.variant.categoryUrl}/${props.variant.productUrl}/v/${props.variant.variantId}`} className="pb-3 relative">
            {props.variant.isNew && <div className="inline-flex bg-blue-500 py-1 px-2 text-slate-300 text-xs absolute -left-2 rounded-xl top-2 -rotate-45">Nuevo</div>}
            { props.variant.isBestSeller && <div className="inline-flex bg-orange-500 py-1 px-2 text-yellow-100 text-xs absolute -right-2 rounded-xl -top-2">
                <MdStar className="text-lg pr-1" /> Best Seller
            </div> }
            <div className="shadow-md rounded-full bg-sky-100 p-1">
                <div className="aspect-square w-full flex items-center justify-center">
                    <img src={props.variant.remoteUrl} alt="Product Name" className="rounded-full h-full w-full object-contain bg-white p-1"></img>
                </div>
            </div>
            <p className="text-center text-gray-500 text-xs px-2 pt-1">{props.variant.name}</p>
        </NavLink>
    </>
}

export default VariantCircle;