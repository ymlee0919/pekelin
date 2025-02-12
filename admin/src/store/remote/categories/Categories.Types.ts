
export interface CategoryContent {
	categoryId: number;
	category: string;
	icon: string;
	url: string;
	remoteUrl: string;
}

export interface CreatedCategory extends CategoryContent {
	readonly createdAt: Date;
}

export interface UpdatedCategory extends CategoryContent {
	readonly updatedAt: Date;
}