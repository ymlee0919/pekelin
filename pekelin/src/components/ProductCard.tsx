import { NavLink } from "react-router-dom";
import { ProductCardInfo } from "../database/database.types";
import { CommonProps } from "../types/Common";

export interface ProductCardProps extends CommonProps {
    product: ProductCardInfo
}

const ProductCard = (props: ProductCardProps) => {
    return <>
        <NavLink to={`/${props.product.categoryUrl}/${props.product.url}`}>
            <div className="shadow-md rounded-sm bg-sky-50 p-2">
                <div className="relative">
                    <img src={props.product.remoteUrl} className="bg-white"></img>
                    <p className="price-label">$ {props.product.price}</p>
                </div>
                <div className="px-4 py-2">
                    <p className="text-xl text-gray-600">{props.product.name}</p>
                    <p className="text-gray-400 text-sm">{props.product.category}</p>
                </div>
            </div>
        </NavLink>
    </>

}

export default ProductCard;