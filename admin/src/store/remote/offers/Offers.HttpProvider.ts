import HttpProvider from "../HttpProvider";
import { AxiosProvider } from "../Provider";
import { IOfferInfo } from "./OfferInfo";
import { CreatedOffer, OfferInfoDTO, UpdatedOffer } from "./Offers.Types";


export default class OffersHttpProvider extends AxiosProvider<Array<IOfferInfo>> {
	async load(): Promise<Array<IOfferInfo>> {
		try {
			return await HttpProvider.get<null, Array<IOfferInfo>>("/offers");
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load offers");
		}
	}

	async get(offerId: number): Promise<IOfferInfo> {
		try {
			return await HttpProvider.get<null, IOfferInfo>(`/offers/${offerId}`);
		} catch (error: any) {
			this.errorCode = error.response ? error.response.code : 0;
			throw Error(error.response ? error.response.message : "Unable to load the requested offer");
		}
	}

	async createOffer(offer: OfferInfoDTO): Promise<CreatedOffer | null> {
		try {
			let created = await HttpProvider.post<OfferInfoDTO, CreatedOffer>("/offers", offer);
			return created;
		} catch (error: any) {
			this.handleError(error, "Unable to create the offer");
		}
		return null;
	}

	async updateOffer(offerId: number, offer: OfferInfoDTO): Promise<UpdatedOffer | null> {
		try {
			let updated = await HttpProvider.put<OfferInfoDTO, UpdatedOffer>(`/offers/${offerId}`, offer);
			return updated;
		} catch (error: any) {
			this.handleError(error, "Unable to update the offer");
		}
		return null;
	}

	async deleteOffer(offerId: number): Promise<boolean> {
		try {
			await HttpProvider.delete<null, any>(`/offers/${offerId}`);
		} catch (error: any) {
			this.handleError(error, "Unable to delete the offer");
		}
		return true;
	}
}