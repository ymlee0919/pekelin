import { Store } from "../Store";
import SetsHttpProvider from "./Sets.HttpProvider";
import { BasicCategory, BasicProduct } from "./Sets.Types";

export default class SetSourceStore extends Store<Array<BasicCategory>> {
	private _provider: SetsHttpProvider;

	constructor() {
		super();
		this._provider = new SetsHttpProvider();
	}

	protected get provider(): SetsHttpProvider {
		return this._provider as SetsHttpProvider;
	}

	protected async getData(): Promise<Array<BasicCategory>> {
		return await this.provider.loadSource();
	}

	getProductsOf(categoryId: number) : BasicProduct[] {
		let category = this._content?.find((category: BasicCategory) => {
			return category.categoryId == categoryId;
		})

		if(!category)
			return [];

		return category.Products;
	}
}

