"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Role } from "@/lib/types";

type TAuthContext = {
    accessToken: string | null;
    setSession: { (auth: null): null; (auth: { accessToken: string; }): NonNullable<TCurrentUser>; };
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

const authDefaultValue: TAuthContext = {
    setSession: ((auth: { accessToken: string } | null) => auth ? (jwtDecode(auth.accessToken) as NonNullable<TCurrentUser>) : null) as TAuthContext["setSession"],
    user: null,
    accessToken: null,
};

const AuthContext = createContext<TAuthContext>(authDefaultValue);

interface Props extends PropsWithChildren {
    initialUser?: TCurrentUser;
    initialAccessToken?: string;
}

export const AuthProvider = ({ children, initialUser, initialAccessToken }: Props) => {
    const [currentUser, setCurrentUser] = useState<TCurrentUser>(initialUser ?? null);
    const [accessToken, setAccessToken] = useState<string | null>(initialAccessToken ?? null);

    /**
     * Updates the current user session based on the provided authentication info.
     *
     * When called with an object containing an `accessToken`, this function:
     *   • Decodes the JWT access token to extract the user payload.
     *   • Stores the decoded user object via `setCurrentUser`.
     *   • Returns the decoded user object.
     *
     * When called with `null`, this function:
     *   • Clears the current user session by setting the current user to `undefined`.
     *   • Returns `null` to indicate the session is cleared.
     *
     * If the access token cannot be decoded (invalid or malformed),
     * it logs the error and returns `null` without updating the session.
     *
     * @template TCurrentUser - The expected shape of the decoded JWT user object.
     *
     * @param { { accessToken: string } | null } auth
     *   The authentication data to set the session:
     *     • `{ accessToken: string }` — a valid access token used to decode
     *         and derive the current user.
     *     • `null` — clears the session and represents a logged-out state.
     *
     * @returns { NonNullable<TCurrentUser> | null }
     *   • Returns the decoded user object when a valid access token is provided.
     *   • Returns `null` when clearing the session or if token decoding fails.
     */
    function setSession(auth: null): null;
    function setSession(auth: { accessToken: string }): NonNullable<TCurrentUser>;
    function setSession(auth: { accessToken: string } | null) {
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
                return null;
            }
        }
    }

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
