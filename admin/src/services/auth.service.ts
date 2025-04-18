// auth.service.ts
import axios from 'axios';
import { AuthCredentials, LoginResponse } from '../types/Auth';

import HttpProvider from '../store/remote/HttpProvider';

const auth = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const authService = {
    async login(credentials: AuthCredentials) : Promise<LoginResponse> {
        return (await HttpProvider.post<AuthCredentials, LoginResponse>('/auth/login', credentials));
    },

    async refreshToken() {
        try {
            const response = await auth.get('/auth/refresh');
            return response.data.accessToken;
        } catch (error) {
            throw error; // Will be handled by interceptor
        }
    },

    async logout() {
        await HttpProvider.post('/auth/logout');
    }
};