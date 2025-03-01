export enum FeatureStatus {
    Original, New, Updated, Deleted
}

export interface BasicFeature {
    title: string;
    content: string;
}

export interface Feature extends BasicFeature {
    featureId: number;
    productId: number;
}

export interface ProductCategory {
    category: string;
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
    isBestSeller: boolean;
    isSet: boolean;
    isNew: boolean;
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
    expiry: number;
    description?: string;
    isSet: boolean;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
}

export interface Product extends BasicProduct {
    Features: Array<Feature>;
    Category: ProductCategory;
}

export interface ProductSet extends Product {
    product1: number,
    product2: number
}

export interface CreatedProduct extends BasicProduct {
    createdAt: Date;
}

export interface UpdatedProduct extends BasicProduct {
    updatedAt: Date;
}

export interface UpdatedSet extends UpdatedProduct {
    element1Id: number;
    element2Id: number;
}

export interface ProductSource {
    productId: number;
    name: string;
}

export interface CategorySource {
	categoryId: number;
	category: string;
    Products: Array<ProductSource>
}
