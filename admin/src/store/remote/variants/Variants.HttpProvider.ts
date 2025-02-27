import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";

import { BasicVariantInfo, CreatedVariant, Variant, UpdatedVariant } from "./Variants.Types";

export interface VariantSearch {
	productId: number
}

export default class VariantsHttpProvider extends AxiosProvider<Array<BasicVariantInfo>, VariantSearch> {
	async load(params: VariantSearch): Promise<Array<BasicVariantInfo>> {
		try {
			return await HttpProvider.get<null, Array<BasicVariantInfo>>(`/products/${params.productId}/variants`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load product variants");
		}
	}

	async get(productId: number, variantId: number): Promise<Variant> {
		try {
			return await HttpProvider.get<null, Variant>(`/products/${productId}/variants/${variantId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the requested variant");
		}
	}

	async createVariant(productId: number, variant: FormData): Promise<CreatedVariant | null> {
		try {
			let created = await HttpProvider.post<FormData, CreatedVariant>(`/products/${productId}/variants`, variant);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the product variant");
		}
		return null;
	}

	async updateVariant(productId: number, variantId: number, variant: FormData): Promise<UpdatedVariant | null> {
		try {
			let updated = await HttpProvider.put<FormData, UpdatedVariant>(`/products/${productId}/variants/${variantId}`, variant);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the product variant");
		}
		return null;
	}

	async changeVisibility(productId: number, variantId: number): Promise<boolean> {
		try {
			await HttpProvider.patch<null, any>(`/products/${productId}/variants/${variantId}/view`);
		} catch (error: any) {
			this.handleError(error, "Unable to update the product variant");
		}
		return true;
	}

	async deleteVariant(productId: number, variantId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/products/${productId}/variants/${variantId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the product variant");
		}
		return true;
	}
}