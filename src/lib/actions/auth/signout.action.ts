"use server";

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-fetch";
import { CookieKey } from "@/lib/constants";

export async function signOut() {
    try {
        await serverFetch("/auth/logout", {
            method: "POST",
            body: JSON.stringify({}), // empty body
        });
    } catch (error) {
        console.error("Backend logout failed", error);
    }

    // Clear the cookies from the browser
    const cookieStore = await cookies();

    // Use .delete() which effectively sets the cookie to expire immediately
    cookieStore.delete(CookieKey.ACCESS_TOKEN);
    cookieStore.delete(CookieKey.REFRESH_TOKEN);
}