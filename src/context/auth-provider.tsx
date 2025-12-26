import { createContext, PropsWithChildren, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Role } from "@/lib/types";

type TAuthContext = {
    access_token: string | null;
    setAuth: (auth: { accessToken: string; user: TCurrentUser; } | null) => void;
    currentUser: TCurrentUser;
};

export type TCurrentUser = {
    accountId: string;
    email: string;
    role: Role
    deviceId: string;
    organizationId: string;
    organizationName: string;
    firstName: string;
    lastName: string;
    profileImage: string | null;
} | undefined

const authDefaultValue: TAuthContext = {
    access_token: null,
    setAuth: () => { },
    currentUser: undefined,
};

const AuthContext = createContext<TAuthContext>(authDefaultValue);

interface Props extends PropsWithChildren { }

export const AuthProvider = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<TCurrentUser>(undefined);

    const handleSetAuth = (auth: { accessToken: string } | null) => {
        if (!auth) {
            setAccessToken(null);
            setCurrentUser(undefined);
        } else {
            setAccessToken(auth.accessToken);
            setCurrentUser(jwtDecode(auth.accessToken));
        }
    }

    return (
        <AuthContext.Provider
            value={{
                access_token: accessToken,
                setAuth: handleSetAuth,
                currentUser: currentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context)
        throw new Error("Please use this hook inside the context provider.");

    return {
        access_token: context.access_token,
        setAuth: context.setAuth,
        user: context.currentUser,
    };
};
