
export interface BasicFeature {
    title: string;
    content: string;
}

export interface VariantFeature extends BasicFeature {
    featureId: number;
    variantId: number;
}

export interface VariantProduct {
    name: string;
}

export interface BasicVariantInfo {
    variantId: number;
    productId: number;
    product: string;
    name: string;
    remoteUrl: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
}

export interface BasicVariant {
    variantId: number;
    productId: number;
    name: string;
    image: string;
    expiry: number;
    remoteUrl: string;
    description?: string;
    isBestSeller: boolean;
    isNew: boolean;
    visible: boolean;
}

export interface Variant extends BasicVariant {
    Features: Array<VariantFeature>;
    Product: VariantProduct;
}

export interface CreatedVariant extends BasicVariant {
    createdAt: Date;
}

export interface UpdatedVariant extends BasicVariant {
    updatedAt: Date;
}
