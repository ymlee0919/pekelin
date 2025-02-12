export interface Feature {
    featureId: number;
    productId: number;
    title: string;
    content: string;
}

export interface ProductCategory {
    category: string;
}

export interface BasicProduct {
    productId: number;
    categoryId: number;
    name: string;
    url: string;
    price: number;
    image: string;
    remoteUrl: string;
    expiry: number;
    description?: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
}

export interface Product extends BasicProduct {
    Features: Array<Feature>;
    Category: ProductCategory;
}

export interface CreatedProduct extends BasicProduct {
    createdAt: Date;
}

export interface UpdatedProduct extends BasicProduct {
    updatedAt: Date;
}
