export type UserAuth = {
    userId: number;
    user: string;
    name: string;
    email: string;
    role: string;
    permissions: string[]
}

export type UserAuthPayload = {
    userId: number;
    user: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    exp: number;
    iat: number;
}