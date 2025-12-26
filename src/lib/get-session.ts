import 'server-only';
import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { TCurrentUser } from '@/context/auth-provider';
import { CookieKey } from './constants';

export const getSession = cache(async (): Promise<TCurrentUser | null> => {
    const token = (await headers()).get('Authorization')?.split(' ')[1]
        || (await cookies()).get(CookieKey.ACCESS_TOKEN)?.value;

    if (!token) {
        return null;
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Cache settings: strictly ensure we don't cache stale user data
            cache: 'no-store',
        });

        if (!res.ok) {
            return null;
        }

        const user = await res.json();
        return user;
    } catch (error) {
        console.error("Auth fetch failed", error);
        return null;
    }
});