import { cookies, headers } from 'next/headers';

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
    const authHeader = (await headers()).get('Authorization');

    // need to manually set the cookie header because calling fetch() from server side cannot access cookies
    // get the cookies from the incoming browser request
    const cookieStore = await cookies()
    const cookieString = cookieStore.toString()
    // .toString() formats them as "key=value; key2=value2"

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            ...(authHeader && { 'Authorization': authHeader }),
            'Cookie': cookieString,
        },
    });
}