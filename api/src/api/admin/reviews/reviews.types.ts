export interface CreatedReviewLink {
    linkId: number;
    url: string;
    clientName: string;
    createdAt: Date;
}

export interface ReviewLink {
    linkId: number;
    url: string;
    clientName: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface Review{
	reviewId: number;
	rate: number;
	comment: string;
	createdAt: Date;
}

export interface ReviewLinkData {
	linkId : number;
	url: string;
	clientName: string;
	place: string;
	Review?: Review;
	createdAt: Date;
	updatedAt?: Date;
}