import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";

import { BasicProductInfo, CreatedProduct, Product, TinyProductInfo, UpdatedProduct } from "./Products.Types";


export default class ProductsHttpProvider extends AxiosProvider<Array<BasicProductInfo>> {
	async load(): Promise<Array<BasicProductInfo>> {
		try {
			return await HttpProvider.get<null, Array<BasicProductInfo>>("/products/list");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load products");
		}
	}

	async get(productId: number): Promise<Product> {
		try {
			return await HttpProvider.get<null, Product>(`/products/${productId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the requested product");
		}
	}

	async createProduct(product: FormData): Promise<CreatedProduct | null> {
		try {
			let created = await HttpProvider.post<FormData, CreatedProduct>("/products", product);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the product");
		}
		return null;
	}

	async updateProduct(productId: number, product: FormData): Promise<UpdatedProduct | null> {
		try {
			let updated = await HttpProvider.put<FormData, UpdatedProduct>(`/products/${productId}`, product);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the product");
		}
		return null;
	}

	async changeVisibility(productId: number): Promise<boolean> {
		try {
			await HttpProvider.patch<null, any>(`/products/${productId}/view`);
		} catch (error: any) {
			this.handleError(error, "Unable to update the product");
		}
		return true;
	}

	async deleteProduct(productId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/products/${productId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the product");
		}
		return true;
	}

	async save(): Promise<boolean | null> {
		try {
			let saved = await HttpProvider.post<null, boolean>("/products/save");
			return saved;
		} catch (error: any) {
			this.handleError(error, "Unable to save the database");
		}
		return null;
	}
}

export class ProductsListHttpProvider extends AxiosProvider<Array<TinyProductInfo>> {
	async load(): Promise<Array<TinyProductInfo>> {
		try {
			return await HttpProvider.get<null, Array<TinyProductInfo>>("/products/list/tiny");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load products list");
		}
	}
}