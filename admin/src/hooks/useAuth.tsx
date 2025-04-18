import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { CommonProps } from "../types/Common";
import { AuthCredentials, LoginResponse } from "../types/Auth";
import { authService } from "../services/auth.service";

export interface AuthHandler {
    user: string | null;
    permissions: string[];
    signIn: (credentials: AuthCredentials) => Promise<LoginResponse>;
    login: (userAuth: string, accessToken: string, permissions: string[]) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthHandler|undefined>(undefined);

export const AuthProvider = (props: CommonProps) => {
    const [user, setUser] = useLocalStorage<string|null>("user", null);
    const [token, setAccessToken] = useLocalStorage<string|null>("token", null);
    const [permissions, setPermissions] = useLocalStorage<string[]>("permissions", []);

    // call this function when you want to authenticate the user
    const signIn = async (credentials: AuthCredentials) : Promise<LoginResponse> => {
        // Implement the authentication process
        try {
            let auth = await authService.login(credentials);

            setUser(auth.account.user);
            setAccessToken(auth.accessToken);
            setPermissions(auth.account.permissions);
            
            return auth;
        }
        catch(error)
        {
            throw error;
        }        
    };

    // call this function when you want to authenticate the user
    const login = (userAuth: string, accessToken: string, permissions: string[]) => {
        // Implement the authentication process
        setUser(userAuth);
        setAccessToken(accessToken);
        setPermissions(permissions);
    };

    // call this function to sign out logged in user
    const logout = async () => {
        // Implement the logout process
        await authService.logout();
        
        setUser(null);
        setAccessToken(null);
        setPermissions([]);
        
        window.history.replaceState({}, '', '/');
    };

    const value = useMemo(
        () => ({ user, login, signIn, logout, permissions }), [user, token]
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