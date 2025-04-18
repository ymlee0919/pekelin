export interface ProductFeature {
    featureId: number;
    productId: number;
    title: string;
    content: string;
}

export interface ProductCategory {
    category: string;
}

export interface TinyProductInfo {
    productId: number;
    category: string;
    name: string;
    remoteUrl: string;
}

export interface BasicProductInfo {
    productId: number;
    category: string;
    name: string;
    gender: string;
    price: number;
    basePrice: number;
    variants: number;
    remoteUrl: string;
    isSet: boolean;
    isNew: boolean;
    isBestSeller: boolean;
    visible: boolean;
}

export interface BasicProduct {
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
    isSet: boolean;
}

export interface Product extends BasicProduct {
    Features: Array<ProductFeature>;
    Category: ProductCategory;
}

export interface CreatedProduct extends BasicProduct {
    createdAt: Date;
}

export interface UpdatedProduct extends BasicProduct {
    updatedAt: Date;
}

export interface ProductForm {
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
	Features: Array<ProductFeature>;
}