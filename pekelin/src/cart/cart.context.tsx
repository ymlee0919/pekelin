import React, { createContext, useEffect, useState } from 'react';
import { CartContent, CartProduct } from './cart.types';

export const CartContext = createContext<{
	cart: CartContent;
	addToCart: (product: CartProduct) => void;
	removeFromCart: (productId: number) => void;
	updateItemCount: (productId: number, count: number) => void;
	clearCart: () => void;
	cartItemCount: number;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [cart, setCart] = useState<CartContent>(() => {
		if (typeof window !== 'undefined') {
		  const savedCart = localStorage.getItem('cart');
		  return savedCart ? JSON.parse(savedCart) : { items: [] };
		}
		return { items: [] };
	  });

	// Load cart from localStorage on initial render
	useEffect(() => {
		const savedCart = localStorage.getItem('cart');
		if (savedCart) {
			setCart(JSON.parse(savedCart));
		}
	}, []);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	}, [cart]);

	const addToCart = (product: CartProduct) => {
		setCart(prevCart => {
		const existingItem = prevCart.items.find(item => item.product.id === product.id);
		
		if (existingItem) {
			return {
				items: prevCart.items.map(item =>
					item.product.id === product.id
					? { ...item, count: item.count + 1 }
					: item
				)
			};
		}
		
		return {
				items: [...prevCart.items, { product, count: 1 }]
			};
		});
	};

	const removeFromCart = (productId: number) => {
		setCart(prevCart => ({
			items: prevCart.items.filter(item => item.product.id !== productId)
		}));
	};

	const updateItemCount = (productId: number, count: number) => {
		if (count <= 0) {
			removeFromCart(productId);
			return;
		}

		setCart(prevCart => ({
			items: prevCart.items.map(item =>
				item.product.id === productId
				? { ...item, count }
				: item
			)
		}));
	};

	const clearCart = () => {
		setCart({ items: [] });
	};

	const cartItemCount = cart.items.reduce((total, item) => total + item.count, 0);

	return (
		<CartContext.Provider value={{ 
			cart, 
			addToCart, 
			removeFromCart, 
			updateItemCount, 
			clearCart,
			cartItemCount
		}}>
		{children}
		</CartContext.Provider>
	);
};

