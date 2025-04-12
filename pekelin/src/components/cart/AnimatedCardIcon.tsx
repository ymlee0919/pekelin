import React from "react";
import { useCart } from "../../cart/useCart";
import { MdOutlineShoppingCart } from "react-icons/md";

export const AnimatedCartIcon = () => {
    const { cartItemCount } = useCart();
    const [isAnimating, setIsAnimating] = React.useState(false);
  
    React.useEffect(() => {
      if (cartItemCount > 0) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500);
        return () => clearTimeout(timer);
      }
    }, [cartItemCount]);
  
    return (
      <div className="relative">
        <div className={`transition-all duration-300 ${isAnimating ? 'scale-120' : 'scale-100'}`}>
          <MdOutlineShoppingCart className='text-xl' />
        </div>
        
        {cartItemCount > 0 && (
          <span className={`absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}>
            {cartItemCount}
          </span>
        )}
      </div>
    );
  };