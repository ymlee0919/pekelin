import { EventResult } from "../../../types/Events";
import { Store } from "../Store";
import HttpVariantsProvider, { VariantSearch } from "./Variants.HttpProvider";
import { BasicVariantInfo, CreatedVariant, Variant, UpdatedVariant } from "./Variants.Types";

export interface StoreVariantSearch {
	productId: number;
	variantId: number;
}

export class SingleVariantStore extends Store<Variant, StoreVariantSearch> {
	private _provider: HttpVariantsProvider;

	constructor() {
		super();
		this._provider = new HttpVariantsProvider();
	}

	protected get provider(): HttpVariantsProvider {
		return this._provider as HttpVariantsProvider;
	}

	protected async getData(params: StoreVariantSearch): Promise<Variant> {
		let info = await this.provider.get(params.productId, params.variantId);
		return info;
	}
}

export class VariantsStore extends Store<Array<BasicVariantInfo>, VariantSearch> {
	private _provider: HttpVariantsProvider;

	constructor() {
		super();
		this._provider = new HttpVariantsProvider();
	}

	protected get provider(): HttpVariantsProvider {
		return this._provider as HttpVariantsProvider;
	}

	protected async getData(params: VariantSearch): Promise<Array<BasicVariantInfo>> {
		return await this.provider.load(params);
	}

	async create(
		productId: string | number,
		variant: FormData
	): Promise<EventResult<CreatedVariant | null>> {
		try {

			let id = typeof productId == "string" ? parseInt(productId) : productId;
			let created = await this.provider.createVariant(id, variant);

			return {
				success: true,
				message: "Variant successfully created",
				info: created
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async update(
		productId: string | number, 
		variantId: string | number, 
		newVariant: FormData
	): Promise<EventResult<UpdatedVariant | null >> {
		try {
			let pId = typeof productId == "string" ? parseInt(productId) : productId;
			let vId = typeof variantId == "string" ? parseInt(variantId) : variantId;

			let updated = await this.provider.updateVariant(pId, vId, newVariant);

			return {
				success: true,
				message: "Variant successfully updated",
				info: updated
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async changeVisibility(
		productId: string | number,
		variantId: string | number
	): Promise<EventResult> {
		try {
			let pId = typeof productId == "string" ? parseInt(productId) : productId;
			let vId = typeof variantId == "string" ? parseInt(variantId) : variantId;

			await this.provider.changeVisibility(pId, vId);

			return {
				success: true,
				message: "Variant successfully updated",
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async delete(
		productId: string | number,
		variantId: string | number
	): Promise<EventResult> {
		try {
			let pId = typeof productId == "string" ? parseInt(productId) : productId;
			let vId = typeof variantId == "string" ? parseInt(variantId) : variantId;

			await this.provider.deleteVariant(pId, vId);

			return {
				success: true,
				message: "Variant successfully deleted",
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}
}

