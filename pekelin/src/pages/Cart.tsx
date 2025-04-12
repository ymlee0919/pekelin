import React from 'react';
import { useCart } from '../cart/useCart';
import { MdInfoOutline, MdOutlineRemoveShoppingCart, MdOutlineShoppingCart } from 'react-icons/md';
import { CartItemCard } from '../components/cart/CardItem';
import RequestBtn from '../components/RequestBtn';

export const Cart: React.FC = () => {
	const { cart, removeFromCart, updateItemCount, clearCart } = useCart();

	const totalPrice = cart.items.reduce(
		(sum, item) => sum + (item.product.price * item.count), 
		0
	);

	return (<div className=" py-8 ">
		<div className="card mt-12 text-gray-600">
			<div className="card-body">
			<h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
				<MdOutlineShoppingCart className="text-primary" />
				Su carrito de compras
			</h2>
			
			{cart.items.length === 0 ? (
				<div className="alert alert-warning my-12">
					<MdInfoOutline className="text-xl" />
					<span>Su carrito de compras está vacío</span>
				</div>
			) : (
				<>
				<div className="space-y-4">
					{cart.items.map(item => (
						<CartItemCard
						key={item.product.id}
						item={item}
						onRemove={removeFromCart}
						onUpdateCount={updateItemCount}
					  />
					
					))}
				</div>
				
				<div className="divider"></div>
				
				<div className="flex flex-col items-end space-y-4">
					<div className="text-2xl font-bold">
						Total: ${totalPrice.toFixed(2)}
					</div>
					<div className="text-sm">
						*El precio del envío puede variar en dependencia del lugar
					</div>
					
					<div className="flex space-x-4">
					<button 
						onClick={clearCart}
						className="btn btn-error"
					>
						<MdOutlineRemoveShoppingCart className='text-xl' /> Vaciar el carrito
					</button>
					<RequestBtn />
					</div>
				</div>
				</>
			)}
			</div>
		</div>
	</div>);
};