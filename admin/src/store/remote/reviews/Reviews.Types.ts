export interface CreationReviewLink {
    name: string;
    place: string
}

export interface CreatedReviewLink {
    linkId: number;
    url: string;
    clientName: string;
    place: string
    createdAt: Date;
}

export interface ReviewLink {
    linkId: number;
    url: string;
    clientName: string;
    place: string
    createdAt: Date;
    updatedAt?: Date;
}

export interface ReviewLinkInfo {
    linkId: number;
    url: string;
    clientName: string;
    place: string
    createdAt: string;
    updatedAt?: string;
}

export interface ReviewDTO {
    rate: number;
    comment: string;
}

interface ReviewContent {
    reviewId: number;
    rate: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Review {
    linkId: number;
    url: string;
    clientName: string;
    place: string
    createdAt: string;
    updatedAt?: string;
    Review?: ReviewContent
}