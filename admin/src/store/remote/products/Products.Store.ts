import { EventResult } from "../../../types/Events";
import { Store } from "../Store";
import HttpProductsProvider, { ProductsListHttpProvider } from "./Products.HttpProvider";
import { BasicProductInfo, CreatedProduct, Product, TinyProductInfo, UpdatedProduct } from "./Products.Types";

export interface ProductSearch {
	productId: number;
}

export class SingleProductStore extends Store<Product, ProductSearch> {
	private _provider: HttpProductsProvider;

	constructor() {
		super();
		this._provider = new HttpProductsProvider();
	}

	protected get provider(): HttpProductsProvider {
		return this._provider as HttpProductsProvider;
	}

	protected async getData(params: ProductSearch): Promise<Product> {
		let info = await this.provider.get(params.productId);
		return info;
	}
}

export class ProductsStore extends Store<Array<BasicProductInfo>> {
	private _provider: HttpProductsProvider;

	constructor() {
		super();
		this._provider = new HttpProductsProvider();
	}

	protected get provider(): HttpProductsProvider {
		return this._provider as HttpProductsProvider;
	}

	protected async getData(): Promise<Array<BasicProductInfo>> {
		return await this.provider.load();
	}

	get Categories() : Array<string> {
		
		let list : Array<string> = [];
		if(this._content)
		{
			this._content.forEach((product: BasicProductInfo) => {
				if(list.indexOf(product.category) == -1)
					list.push(product.category)
			})
		}
		return list;
	}

	async create(offer: FormData): Promise<EventResult<CreatedProduct | null | any >> {
		try {
			let created = await this.provider.createProduct(offer);

			return {
				success: true,
				message: "Product successfully created",
				info: created
			};
		} catch (error: any) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error)
			};
		}
	}

	async update(
		productId: string | number, 
		newProduct: FormData
	): Promise<EventResult<UpdatedProduct | null >> {
		try {
			let id = typeof productId == "string" ? parseInt(productId) : productId;
			let updated = await this.provider.updateProduct(id, newProduct);

			return {
				success: true,
				message: "Product successfully updated",
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

	async changeVisibility(productId: string | number): Promise<EventResult> {
		try {
			let id = typeof productId == "string" ? parseInt(productId) : productId;
			await this.provider.changeVisibility(id);

			return {
				success: true,
				message: "Product successfully updated",
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async delete(productId: string | number): Promise<EventResult> {
		try {
			let id = typeof productId == "string" ? parseInt(productId) : productId;
			await this.provider.deleteProduct(id);

			return {
				success: true,
				message: "Product successfully deleted",
			};
		} catch (error) {
			return {
				success: false,
				errorCode: this.provider.lastErrorCode ?? 0,
				message: String(error),
			};
		}
	}

	async save(): Promise<EventResult> {
		try {
			await this.provider.save();

			return {
				success: true,
				message: "Information saved",
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

export class ProductsListStore extends Store<TinyProductInfo[]> {
	private _provider: ProductsListHttpProvider;

	constructor() {
		super();
		this._provider = new ProductsListHttpProvider();
	}

	protected get provider(): ProductsListHttpProvider {
		return this._provider as ProductsListHttpProvider;
	}

	protected async getData(): Promise<TinyProductInfo[]> {
		return await this.provider.load();
	}
}