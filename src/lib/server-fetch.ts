import { headers } from 'next/headers';

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
    const authHeader = (await headers()).get('Authorization');

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader }),
        },
        credentials: 'include',
    });
}