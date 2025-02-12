export interface OfferItemDTO {
	itemName: string;
	itemDetails?: string;
}

export interface OfferInfoDTO {
	name: string;
	price: number;
	showHome: boolean;
	main: boolean;
	items: OfferItemDTO[];
}

export interface CreatedOffer {
	offerId: number;
	name: string;
	price: number;
	showHome: boolean;
	main: boolean;
	createdAt: Date;
}

export interface UpdatedOffer {
	offerId: number;
	name: string;
	price: number;
	showHome: boolean;
	main: boolean;
	createdAt: Date;
}
