export interface ProductFeature {
    featureId: number;
    productId: number;
    title: string;
    content: string;
}

export interface ProductCategory {
    category: string;
}

export interface BasicProductInfo {
    productId: number;
    category: string;
    name: string;
    price: number;
    basePrice: number;
    variants: number;
    remoteUrl: string;
    isNew: boolean;
    isBestSeller: boolean;
    visible: boolean;
}

export interface BasicProduct {
    productId: number;
    categoryId: number;
    name: string;
    url: string;
    price: number;
    basePrice: number;
    image: string;
    remoteUrl: string;
    description?: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
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
    image: FileList;
    price: number;
    basePrice: number;
    description?: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
	Features: Array<ProductFeature>;
}