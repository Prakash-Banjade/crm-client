"use server";

import { SignInFormData } from "@/components/auth/sign-in-form";
import { serverFetch } from "@/lib/server-fetch";
import { extractErrorMessage } from "@/lib/utils";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { CookieKey } from "@/lib/constants";

export async function signIn(formData: SignInFormData) {
    const res = await serverFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        const message = extractErrorMessage(data);
        throw new Error(message.message);
    }

    // --- MANUALLY SET COOKIES IN BROWSER ---
    const setCookieHeader = res.headers.get('set-cookie');

    if (setCookieHeader) {
        // The header might be a comma-separated string or you might need logic to split multiple cookies
        // If using Node 18+ / Next.js latest, res.headers.getSetCookie() returns an array
        const cookieStrings = res.headers.getSetCookie
            ? res.headers.getSetCookie()
            : setCookieHeader.split(', '); // Fallback for older environments

        const cookieStore = await cookies();

        for (const cookieString of cookieStrings) {
            const parsedCookie = parse(cookieString);
            // The first key is the cookie name
            const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];

            // Clean up options to match CookieSerializeOptions (removing the value itself)
            const { ...options } = parsedCookie;
            delete options[cookieName];

            // Convert max-age to expires if needed, or Next.js handles it.
            // Note: 'secure', 'httpOnly' etc are keys in parsedCookie with value 'true' or undefined

            if (!cookieValue) continue;

            cookieStore.set({
                name: cookieName,
                value: cookieValue,
                httpOnly: true, // ideally read from parsedCookie options
                secure: process.env.NODE_ENV === 'production',
                path: options.path || '/',
                sameSite: (options.samesite as any) || 'lax',
                // Calculate expires if max-age is present
                maxAge: options['max-age'] ? parseInt(options['max-age']) : undefined,
                expires: options.expires ? new Date(options.expires) : undefined,
            });
        }
    }

    return data as { [CookieKey.ACCESS_TOKEN]: string };
}