import React from 'react';

import { Link } from 'react-router-dom';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { useCart } from '../../cart/useCart';

export const CartIcon: React.FC = () => {
  const { cartItemCount } = useCart();
  
  return (
    <Link to={'/cart'} className='px-3'>
        <div className="cart-icon">
        <MdOutlineShoppingCart className='text-xl' />
        {cartItemCount > 0 && (
            <span className="cart-count">{cartItemCount}</span>
        )}
        </div>
    </Link>
  );
};