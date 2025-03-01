import { EventResult } from "../../../types/Events";
import { ProductSearch } from "../products/Products.Store";
import { CreatedProduct, UpdatedProduct } from "../products/Products.Types";
import { Store } from "../Store";
import SetsHttpProvider from "./Sets.HttpProvider";
import { BasicCategory, SetInfo } from "./Sets.Types";

export default class SetsStore extends Store<SetInfo, ProductSearch> {
	private _provider: SetsHttpProvider;

	constructor() {
		super();
		this._provider = new SetsHttpProvider();
	}

	protected get provider(): SetsHttpProvider {
		return this._provider as SetsHttpProvider;
	}

	protected async getData(params: ProductSearch): Promise<SetInfo> {
		return await this.provider.load(params.productId);
	}

	async loadSource(): Promise<Array<BasicCategory>> {
		return await this.provider.loadSource();
	}

	async create(offer: FormData): Promise<EventResult<CreatedProduct | null>> {
		try {
			let created = await this.provider.createSet(offer);

			return {
				success: true,
				message: "Set successfully created",
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
		newProduct: FormData
	): Promise<EventResult<UpdatedProduct | null >> {
		try {
			let id = typeof productId == "string" ? parseInt(productId) : productId;
			let updated = await this.provider.updateSet(id, newProduct);

			return {
				success: true,
				message: "Set successfully updated",
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
}

