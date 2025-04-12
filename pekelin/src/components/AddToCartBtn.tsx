import toast from "react-hot-toast";
import { useCart } from "../cart/useCart";
import { CommonProps } from "../types/Common";
import { MdAddShoppingCart } from 'react-icons/md';
import { CartProduct } from "../cart/cart.types";

export interface AddToCartBtnProps extends CommonProps {
    product: CartProduct
}

const AddToCartBtn = (props: AddToCartBtnProps) => {
    
    const {addToCart} = useCart();

    return <>
        <a 
            className="btn btn-info"
            onClick={() => {
                addToCart(props.product);
                toast.success(() => <span><b>{props.product.name}</b> adicionado a su carrito de compras</span>, {
                    duration: 2500,
                });
            }}
        >
            <MdAddShoppingCart className="text-xl" /> Añadir a la cesta
        </a>
        
    </>
}

export default AddToCartBtn;