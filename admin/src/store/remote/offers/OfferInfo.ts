import { EmptyEvent, EventResult } from "../../../types/Events";
import { OfferInfoDTO } from "./Offers.Types";

export interface IOfferItem {
	offerItemId: number;
	itemName: string;
	itemDetails?: string;
}

export interface IOfferInfo {
	
	readonly offerId: number;
	name: string;
	price: number;
	showHome: boolean;
	main: boolean;
	readonly Items: IOfferItem[];
}

export class OfferInfo implements IOfferInfo {
	offerId: number;

	private _name: string;
	private _showHome: boolean;
	private _price: number;
	private _main: boolean;
	private _items: Array<IOfferItem>;

	private _onRender: EmptyEvent;

	constructor(offer: IOfferInfo | null = null) {
		this.offerId = offer?.offerId ?? 0;
		this._price = offer?.price ?? 0;
		this._name = offer?.name ?? 'Offer';
		this._items = (!!offer) 
			? offer.Items.map((item) => {
				return {itemName:item.itemName, offerItemId:item.offerItemId, itemDetails:item.itemDetails}}
			) : [];
		this._showHome = !!offer?.showHome;
		this._main = offer?.main ?? false;

		this._onRender = () => {
			return;
		};
	}

	set onRender(render: EmptyEvent) {
		this._onRender = render;
	}

	get(id: number): IOfferItem {
		let result = this._items.find((item) => {
			return item.offerItemId == id;
		});
		return result ?? { offerItemId: 0, itemName: "", itemDetails: "" };
	}

	public get name(): string {
		return this._name;
	}
	
	public set name(value: string) {
		this._name = value;
		this._onRender();
	}

	public get showHome(): boolean {
		return this._showHome;
	}
	
	public set showHome(value: boolean) {
		this._showHome = value;
		this._onRender();
	}

	public get price(): number {
		return this._price;
	}

	public set price(value: number) {
		this._price = value;
		this._onRender();
	}

	public get main(): boolean {
		return this._main;
	}

	public set main(value: boolean) {
		this._main = value;
		this._onRender();
	}

	public get Items(): Array<IOfferItem> {
		return this._items;
	}

	private equals(item1: string, item2: string): boolean {
		let i1 = item1.trim().toLocaleLowerCase(),
			i2 = item2.trim().toLocaleLowerCase();

		while (i1.indexOf("  ") != -1) i1 = i1.replace("  ", " ");
		while (i2.indexOf("  ") != -1) i2 = i2.replace("  ", " ");

		return i1 == i2;
	}

	addItem(item: string, details: string = ""): EventResult {
		// Validate the new item do not exists
		let valid = true;
		this._items.forEach((i: IOfferItem) => {
			if (this.equals(item, i.itemName)) valid = false;
		});

		if (valid) {
			this._items.push({
				offerItemId: Date.now(),
				itemName: item,
				itemDetails: details,
			});
			this._onRender();
			return { success: true, message: "Item succesfully added" };
		}

		return { success: false, message: "The new item already exists" };
	}

	updateItem(offerItemId: number, newItem: string, details: string = ""): EventResult {
		let index = this._items.findIndex((item) => {
			return item.offerItemId === offerItemId;
		});

		if (index == -1) return { success: false, message: "The item you want to update do not exists" };

		// If the item name is not equal, all others must be compared
		if (!this.equals(this._items[index].itemName, newItem)) {
			let valid = true;
			this._items.forEach((item: IOfferItem, idx: number) => {
				if (idx != index && this.equals(item.itemName, newItem)) valid = false;
			});

			if (!valid) return { success: false, message: "The new item already exists" };
		}

		this._items[index].itemName = newItem;
		this._items[index].itemDetails = details;
		this._onRender();

		return { success: true, message: "Item succesfully updated" };
	}

	deleteItem(offerItemId: number) {
		let index = this._items.findIndex((item) => {
			return item.offerItemId === offerItemId;
		});

		if (index == -1) return { success: false, message: "The item you want to update do not exists" };

		this._items.splice(index, 1);
		this._onRender();

		return { success: true, message: "Item succesfully deleted" };
	}

    get DTO() : OfferInfoDTO {
        return {
			name: this._name,
            price: this._price,
            showHome: this._showHome,
			main: this._main,
            items : this._items.map((item) => {
                let {offerItemId, ...result} = item;
                return result;
            })
        }
    }
}