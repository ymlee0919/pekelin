import { EventResult } from "../../../types/Events";
import { Store } from "../Store";
import HttpOffersProvider from "./Offers.HttpProvider";
import { OfferInfo, IOfferInfo } from "./OfferInfo";
import { CreatedOffer, OfferInfoDTO, UpdatedOffer } from "./Offers.Types";

export interface OfferSearch {
	offerId: number;
}

export class SingleOfferStore extends Store<OfferInfo, OfferSearch> {
	private _provider: HttpOffersProvider;

	constructor() {
		super();
		this._provider = new HttpOffersProvider();
	}

	protected get provider(): HttpOffersProvider {
		return this._provider as HttpOffersProvider;
	}

	protected async getData(params: OfferSearch): Promise<OfferInfo> {
		let info = await this.provider.get(params.offerId);
		return new OfferInfo(info);
	}
}

export class OffersStore extends Store<Array<IOfferInfo>> {
	private _provider: HttpOffersProvider;

	constructor() {
		super();
		this._provider = new HttpOffersProvider();
	}

	protected get provider(): HttpOffersProvider {
		return this._provider as HttpOffersProvider;
	}

	protected async getData(): Promise<Array<IOfferInfo>> {
		return await this.provider.load();
	}

	async create(offer: OfferInfoDTO): Promise<EventResult<CreatedOffer | null>> {
		try {
			let created = await this.provider.createOffer(offer);

			return {
				success: true,
				message: "Offer successfully created",
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
		offerId: string | number, 
		newOffer: OfferInfoDTO
	): Promise<EventResult<UpdatedOffer | null >> {
		try {
			let id = typeof offerId == "string" ? parseInt(offerId) : offerId;
			let updated = await this.provider.updateOffer(id, newOffer);

			return {
				success: true,
				message: "Offer successfully updated",
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

	async delete(offerId: string | number): Promise<EventResult> {
		try {
			let id = typeof offerId == "string" ? parseInt(offerId) : offerId;
			await this.provider.deleteOffer(id);

			return {
				success: true,
				message: "Offer successfully deleted",
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

