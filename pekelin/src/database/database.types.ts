export interface Feature {
	title: string,
	content: string
}

export interface Variant {
	variantId: number,
	productId: number,
	name: string,
	description?: string,
	isBestSeller: boolean,
	isNew: boolean,
	remoteUrl: string,
	expiry: number,
	Features: Feature[],
}

export interface Product { 
	productId: number,
	categoryId: number,
	name: string,
	url: string,
	description?: string,
	price: number,
	isNew: boolean,
	isBestSeller: boolean,
	remoteUrl: string,
	expiry: number,
	Features: Feature[],
	Variants: Variant[]
}


export interface ProductInfo {
	productId: number,
	categoryId: number,
	name: string,
	category: string,
	url: string,
	categoryUrl: string,
	description?: string,
	price: number,
	isNew: boolean,
	isBestSeller: boolean,
	remoteUrl: string,
	Variants: Variant[]
}

export interface Category {
	categoryId: number,
	category: string,
	description: string,
	url: string,
	remoteUrl: string,
	expiry: number,
	Products : Product[]
}

export interface CategoryInfo {
	categoryId: number,
	category: string,
	description: string,
	url: string,
	remoteUrl: string,
}

export type DataBase = Array<Category>;

/** Indexes */

export type CategoryIndex = {
	[key : string] : Category
};

export type ProductIndex = {
	[key : string] : {
		[index : string] : Product
	}
};

export type VariantIndex = {
	[key : string] : {
		[index : string] : {
			[variant: number] : Variant
		}
	}
};

export type CategoryList = {
	[key : number] : Category
};

export type ProductList = {
	[key : number] : Product
};

export type VariantList = {
	[key : number] : Variant
};

/** View */
export interface ProductCardInfo { 
	productId: number,
	categoryUrl: string,
	category: string,
	name: string,
	url: string,
	description?: string,
	price: number,
	isNew: boolean,
	isBestSeller: boolean,
	remoteUrl: string
}

export interface VariantCardInfo {
	variantId: number,
	productUrl: string,
	categoryUrl: string,
	productName: string,
	name: string,
	price: number,
	description?: string,
	isBestSeller: boolean,
	isNew: boolean,
	remoteUrl: string,
}

export interface VariantFullInfo {
	variantId: number,
	productId: number,
	productUrl: string,
	categoryUrl: string,
	category: string,
	productName: string,
	name: string,
	price: number,
	description?: string,
	isBestSeller: boolean,
	isNew: boolean,
	remoteUrl: string,
	Features: Feature[]
}