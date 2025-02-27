interface Feature {
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
	url: string,
	description?: string,
	price: number,
	isNew: boolean,
	isBestSeller: boolean,
	remoteUrl: string,
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