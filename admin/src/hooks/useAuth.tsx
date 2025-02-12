import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { CommonProps } from "../types/Common";

export interface AuthHandler {
    user: string | null;
    login: (userAuth: string, accessToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthHandler|undefined>(undefined);

export const AuthProvider = (props: CommonProps) => {
    const [user, setUser] = useLocalStorage<string|null>("user", null);
    const [token, setAccessToken] = useLocalStorage<string|null>("token", null);

    // call this function when you want to authenticate the user
    const login = async (userAuth: string, accessToken: string) => {
        // Implement the authentication process
        setUser(userAuth);
        setAccessToken(accessToken);
    };

    // call this function to sign out logged in user
    const logout = () => {
        // Implement the logout process
        setUser(null);
        setAccessToken(null);
        window.history.replaceState({}, '', '/');
    };

    const value = useMemo(
        () => ({ user, login, logout, }), [user, token]
    );

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export const useAuth = () : AuthHandler => {
    
    const context = useContext(AuthContext);

    if(context === undefined){ 
        throw new Error('useStores must be used within an AuthProvider'); 
    }

    return context;
};