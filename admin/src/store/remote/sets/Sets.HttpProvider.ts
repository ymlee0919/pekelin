import HttpProvider from "../HttpProvider";
import { CreatedProduct, UpdatedProduct } from "../products/Products.Types";
import { AxiosProvider } from "../Provider";
import { BasicCategory, SetInfo } from "./Sets.Types";


export default class SetsHttpProvider extends AxiosProvider<SetInfo> {
	async load(productId: number): Promise<SetInfo> {
		try {
			return await HttpProvider.get<null, SetInfo>(`/products/sets/${productId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the product");
		}
	}

	async loadSource(): Promise<Array<BasicCategory>> {
		try {
			return await HttpProvider.get<null, Array<BasicCategory>>("/products/sets/source");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load set source");
		}
	}

	async createSet(set: FormData): Promise<CreatedProduct | null> {
		try {
			let created = await HttpProvider.post<FormData, CreatedProduct>("/products/sets", set);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the set");
		}
		return null;
	}

	async updateSet(productId: number, product: FormData): Promise<UpdatedProduct | null> {
		try {
			let updated = await HttpProvider.put<FormData, UpdatedProduct>(`/products/sets/${productId}`, product);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the product");
		}
		return null;
	}
}