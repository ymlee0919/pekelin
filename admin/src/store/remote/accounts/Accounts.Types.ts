export interface AccountContent {
	readonly userId: number;
	readonly roleId: number;
	readonly user: string;
	readonly name: string;
	readonly email: string;
	readonly role: string;
}

export interface AccountCreationDTO {
	readonly name: string;
	readonly user: string;
	readonly email: string;
	readonly password: string;
	readonly roleId: number;
}

export interface AccountUpdateDTO {
	readonly name: string;
	readonly email: string;
}

export interface AccountCredentialsUpdateDTO {
	readonly user: string;
	readonly roleId: number;
	readonly prevPassword?: string;
	readonly password?: string;
}

export interface CreatedAccount {
	userId: number;
	user: string;
	name: string;
	email: string;
	createdAt: Date;
}

export interface UpdatedAccount {
    userId: number;
    user: string;
    name: string;
	email: string;
    updatedAt: Date
}
