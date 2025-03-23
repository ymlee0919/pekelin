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