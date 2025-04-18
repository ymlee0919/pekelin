export type AuthCredentials = {
    user: string;
    password: string;
    remember: boolean;
};

export type LoginResponse = {
    account: {
        userId: number;
        user: string;
        name: string;
        permissions: string[];
    },
    accessToken: string;
}