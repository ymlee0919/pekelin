import { ProductFeature } from "../products/Products.Types";

export interface BasicProduct {
    productId: number;
    name: string;
}

export interface BasicCategory {
	categoryId: number;
	category: string;
    Products: Array<BasicProduct>
}

export interface SetsForm {
    categoryId: number;
    name: string;
    gender: boolean,
    image: FileList;
    price: number;
    basePrice: number;
    description?: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
    product1: number;
    product2: number;
    Features: Array<ProductFeature>;
}

export interface SetInfo {
    productId: number;
    categoryId: number;
    name: string;
    gender: string;
    url: string;
    price: number;
    basePrice: number;
    image: string;
    remoteUrl: string;
    description?: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
    product1: number;
    product2: number;
    Features: Array<ProductFeature>;
}