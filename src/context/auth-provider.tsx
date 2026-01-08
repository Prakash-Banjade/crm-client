"use client";

import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Role } from "@/lib/types";

type TAuthContext = {
    accessToken: string | null;
    setSession: (auth: { accessToken: string } | null) => TCurrentUser;
    user: TCurrentUser;
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
} | null

const AuthContext = createContext<TAuthContext | undefined>(undefined);

interface Props extends PropsWithChildren {
    initialUser?: TCurrentUser;
    initialAccessToken?: string;
}

export const AuthProvider = ({ children, initialUser, initialAccessToken }: Props) => {
    const [currentUser, setCurrentUser] = useState<TCurrentUser>(initialUser ?? null);
    const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken ?? null);

    const setSession = useCallback((auth: { accessToken: string } | null): TCurrentUser => {
        if (!auth) {
            setCurrentUser(null);
            setAccessToken(null);
            return null;
        } else {
            try {
                const user: TCurrentUser = jwtDecode(auth.accessToken);
                setCurrentUser(user);
                setAccessToken(auth.accessToken);
                return user;
            } catch (e) {
                console.error("Failed to decode JWT:", e);
                return null;
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ setSession, user: currentUser, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context)
        throw new Error("Please use this hook inside the context provider.");

    return context;
};

