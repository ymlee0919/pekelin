
export type CartProduct = {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    isSet: boolean;
    secondImage?: string;
};

export type CartItem = {
    product: CartProduct;
    count: number;
};

export type CartContent = {
    items: CartItem[];
};