
export interface AccountCredentials {
    user: string;
    password?: string;
    roleId: number;
}

export interface AccountCreation {
    name: string;
    user: string;
    email: string;
    password: string;
    roleId: number;
}

export interface BaseAccountInfo {
    userId: number;
    user: string;
    name: string;
    email: string;
}

export interface AccountInfo {
    userId: number;
    user: string;
    name: string;
    email: string;
    roleId: number;
    role: string;
}

export interface CreatedAccount extends BaseAccountInfo {
    createdAt: Date;
}

export interface UpdatedAccount extends BaseAccountInfo {
    updatedAt: Date;
}
