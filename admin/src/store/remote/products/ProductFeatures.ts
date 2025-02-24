import { EventResult } from "../../../types/Events";
import { ProductFeature } from "./Products.Types";

export enum FeatureStatus {
	Original, New, Updated, Deleted
}

export interface IProductFeature {
	featureId: number;
	status: FeatureStatus;
    title: string;
    content: string;
}

export class ProductFeaturesList {

	private _list: Array<IProductFeature>;

	constructor(initialList: Array<ProductFeature> | null = null) 
	{	
		if(!initialList)
			this._list = new Array<IProductFeature>();
		else
			this._list = initialList.map((item: ProductFeature) => {
				return {
					featureId: item.featureId,
					status: FeatureStatus.Original,
					title: item.title,
					content: item.content
				}
		});
	}

	get list() : Array<IProductFeature> {
		return this._list;
	}

	get(featureId:number) : IProductFeature | null {
		// Find the index of the selected item
		let index = this._list.findIndex((item) => {
			return item.featureId === featureId;
		});

		return (index = -1) ? this._list[index] : null;
	}

	private equals(item1: string, item2: string): boolean {
		let i1 = item1.trim().toLocaleLowerCase(),
			i2 = item2.trim().toLocaleLowerCase();

		while (i1.indexOf("  ") != -1) i1 = i1.replace("  ", " ");
		while (i2.indexOf("  ") != -1) i2 = i2.replace("  ", " ");

		return i1 == i2;
	}

	addItem(title: string, content: string = ""): EventResult {
		// Validate the new item do not exists
		let valid = true;

		this._list.forEach((item: IProductFeature) => {
			if (this.equals(title, item.title)) valid = false;
		});

		if (valid) {
			this._list.push({
				featureId: Date.now(),
				status: FeatureStatus.New,
				title, content
			});
			
			return { success: true, message: "Item succesfully added" };
		}

		return { success: false, message: "The new item already exists" };
	}

	updateItem(featureId: number, newTitle: string, details: string = ""): EventResult 
	{
		// Find the index of the selected item
		let index = this._list.findIndex((item) => {
			return item.featureId === featureId;
		});

		if (index == -1) 
			return { success: false, message: "The item you want to update do not exists" };

		if (this._list[index].status == FeatureStatus.Deleted)
			return { success: false, message: "The item you want to update was deleted" };

		// If the item name is not equal, all others must be compared
		if (!this.equals(this._list[index].title, newTitle)) {
			let valid = true;
			this._list.forEach((item: IProductFeature, idx: number) => {
				// Skip same index, equal title and deleted items
				if (idx != index && this.equals(item.title, newTitle) && item.status != FeatureStatus.Deleted) 
					valid = false;
			});

			if (!valid) return { 
				success: false, message: "The new item already exists" 
			};
		}

		this._list[index].title = newTitle;
		this._list[index].content = details;
		this._list[index].status = FeatureStatus.Updated;
		
		return { success: true, message: "Item succesfully updated" };
	}

	deleteItem(featureId: number) {
		let index = this._list.findIndex((item) => {
			return item.featureId === featureId;
		});

		if (index == -1) return { success: false, message: "The item you want to update do not exists" };

		this._list[index].status = FeatureStatus.Deleted;

		return { success: true, message: "Item succesfully deleted" };
	}
}