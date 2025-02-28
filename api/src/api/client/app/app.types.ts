interface Feature {
	title: string,
	content: string
}

interface Variant {
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

interface Product { 
	productId: number,
	categoryId: number,
	name: string,
	gender: string,
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

interface Category {
	categoryId: number,
	category: string,
	description?: string,
	url: string,
	remoteUrl: string,
	expiry: number,
	Products : Product[]
}

export type DataBase = Array<Category>;