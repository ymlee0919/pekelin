
export interface AccountCredentials {
    user: string;
    password?: string;
}

export interface AccountCreation {
    name: string;
    user: string;
    email: string;
    password: string;
}

export interface AccountInfo {
    userId: number;
    user: string;
    name: string;
    email: string;
}

export interface CreatedAccount extends AccountInfo {
    createdAt: Date;
}

export interface UpdatedAccount extends AccountInfo {
    updatedAt: Date;
}
