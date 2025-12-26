"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import { CookieKey } from "@/lib/constants";

export async function signOut() {
    try {
        await serverFetch("/auth/logout", {
            method: "POST",
        });
    } catch (error) {
        console.error("Backend logout failed", error);
    }

    // Clear the cookies from the browser
    const cookieStore = await cookies();

    // Use .delete() which effectively sets the cookie to expire immediately
    cookieStore.delete(CookieKey.ACCESS_TOKEN);
    cookieStore.delete(CookieKey.REFRESH_TOKEN);

    // Note: `redirect` throws an error internally in Next.js, so it must be outside try/catch
    redirect("/auth/sign-in");
}