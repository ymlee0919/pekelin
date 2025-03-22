import { Store } from "../Store";
import { EventResult } from "../../../types/Events";
import OffersHttpProvider from "./Categories.HttpProvider";
import { CreatedCategory, CategoryContent, UpdatedCategory } from "./Categories.Types";

export default class CategoryStore extends Store<Array<CategoryContent>> {
	private _provider: OffersHttpProvider;

	constructor() {
		super();
		this._provider = new OffersHttpProvider();
	}

	protected getData(): Promise<Array<CategoryContent>> {
		return this._provider.load();
	}

	protected get provider(): OffersHttpProvider {
		return this._provider as OffersHttpProvider;
	}

	get(categoryId: number): CategoryContent | undefined {
		return this._content?.find((item: CategoryContent) => {
			return item.categoryId == categoryId;
		});
	}

	async addCategory(data: FormData): Promise<EventResult<CreatedCategory | null>> {
		let created = await this.provider.addCategory(data);

		return {
			success: true,
			message: "Category successfully created",
			info: created,
		};
	}

	async updateCategory(categoryId: number, data: FormData): Promise<EventResult<UpdatedCategory | null>> {
		let updated = await this.provider.updateCategory(categoryId, data);

		return {
			success: true,
			message: "Category successfully updated",
			info: updated,
		};
	}

	async delete(categoryId: number): Promise<EventResult> {
		await this.provider.delete(categoryId);

		return {
			success: true,
			message: "Category successfully deleted",
		};
	}
}

