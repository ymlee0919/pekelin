export interface Review{
	reviewId: number;
	rate: number;
	comment: string;
	createdAt: Date;
}

export interface ReviewLink {
	linkId : number;
	url: string;
	clientName: string;
	Review?: Review;
	createdAt: Date;
	updatedAt?: Date;
}