
export interface CategoryInfo {
    categoryId: number;
    category: string;
    description: string;
    icon: string;
    url: string;
    remoteUrl: string;
    expiry: number;
}

export interface CreatedCategory extends CategoryInfo {
    createdAt: Date;
}

export interface UpdatedCategory extends CategoryInfo {
    updatedAt: Date;
}


