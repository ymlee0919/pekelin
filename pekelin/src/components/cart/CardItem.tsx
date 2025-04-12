import React from 'react';
import { FiX } from 'react-icons/fi';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { CartItem } from '../../cart/cart.types';

type CartItemCardProps = {
  item: CartItem
  onRemove: (id: number) => void;
  onUpdateCount: (id: number, count: number) => void;
};

export const CartItemCard: React.FC<CartItemCardProps> = ({ 
	item, 
	onRemove, 
	onUpdateCount 
}) => {
	return (
		<div className="card card-compact sm:card-side bg-base-200 shadow-sm w-full p-2">
			<figure>
				<div className="stack">
					<div className="avatar">
						<div className={`${item.product.isSet ? 'w-36 mr-9' : 'w-48'} rounded`}
							style={item.product.isSet ? {transform: "translateY(-15px) scale(95%)"} : {}}
						>
							<img src={item.product.image} 
								alt={item.product.name} 
							/>
						</div>
					</div>
					{item.product.isSet &&
						<div className="avatar">
							<div
								className="w-36 rounded"
								style={{transform: "translateY(-10%) translateX(40%) scale(95%)"}}
							>
								<img src={item.product.secondImage} 
									alt={item.product.name} 
								/>
							</div>
						</div>
					}
				</div>
			</figure>
			{/*<figure className="sm:w-32 w-full h-48 sm:h-auto">
				<img 
					src={item.product.image} 
					alt={item.product.name}
					className="w-full h-full object-cover"
				/>
			</figure>*/}
		<div className="card-body">
			<div className="flex justify-between items-start">
				<div>
					<h3 className="card-title text-lg sm:text-xl">{item.product.name}</h3>
					<div className="badge badge-outline mt-1">{item.product.category}</div>
					<p className="text-md sm:text-lg font-semibold mt-2">
						${item.product.price.toFixed(2)}
					</p>
				</div>
				<button 
					onClick={() => onRemove(item.product.id)}
					className="btn btn-circle btn-sm btn-ghost"
					aria-label="Remove item"
				>
					<FiX className="text-lg" />
				</button>
			</div>
			
			<div className="card-actions justify-between sm:justify-end items-center mt-4">
				<div className="join">
					<button 
						className="join-item btn btn-sm"
						onClick={() => onUpdateCount(item.product.id, item.count - 1)}
						aria-label="Decrease quantity"
					>
					<FaMinus />
					</button>
					<span className="join-item btn btn-sm no-animation pointer-events-none">
					{item.count}
					</span>
					<button 
						className="join-item btn btn-sm"
						onClick={() => onUpdateCount(item.product.id, item.count + 1)}
						aria-label="Increase quantity"
						>
					<FaPlus />
					</button>
				</div>
				<p className="text-right font-bold sm:hidden">
					${(item.product.price * item.count).toFixed(2)}
				</p>
			</div>
		</div>
		</div>
	);
};