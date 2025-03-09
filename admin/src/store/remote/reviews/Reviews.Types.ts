export interface CreationReviewLink {
    name: string;
}

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

export interface ReviewLinkInfo {
    linkId: number;
    url: string;
    clientName: string;
    createdAt: string;
    updatedAt?: string;
}