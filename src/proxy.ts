import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { CookieKey } from './lib/constants';

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get(CookieKey.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(CookieKey.REFRESH_TOKEN)?.value;

    let currentToken = accessToken;

    // 1. Logic to check if we need to refresh
    let isExpired = false;
    if (accessToken) {
        try {
            const decoded: any = jwtDecode(accessToken);
            // Refresh if expired or expiring within 30 seconds
            isExpired = decoded.exp < (Date.now() / 1000) + 30;
        } catch {
            isExpired = true;
        }
    }

    // 2. Refresh the token if missing or expired, but refresh token exists
    if ((!accessToken || isExpired) && refreshToken) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Cookie': `${CookieKey.REFRESH_TOKEN}=${refreshToken}`,
                },
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                currentToken = data.access_token as string;

                // Create the response and sync the new token back to the browser cookies
                const response = NextResponse.next();
                response.cookies.set(CookieKey.ACCESS_TOKEN, currentToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                });

                // Attach the fresh token to the headers for the current request
                response.headers.set('Authorization', `Bearer ${currentToken}`);
                return response;
            }
        } catch (error) {
            console.error("Token refresh failed in proxy:", error);
            // Optional: Clear cookies and redirect to login if refresh fails
        }
    }

    // 3. Normal flow: Attach existing token to headers
    const requestHeaders = new Headers(request.headers);
    if (currentToken) {
        requestHeaders.set('Authorization', `Bearer ${currentToken}`);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// Ensure this runs for API calls and Page renders
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
        '/admin/:path*',
        '/super-admin/:path*',
        '/counselor/:path*',
    ],
};