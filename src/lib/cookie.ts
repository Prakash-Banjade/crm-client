type CookieOptions = {
    path?: string;
    domain?: string;
    expires?: Date;
    maxAge?: number;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
};

// Set a cookie
export const setCookie = (
    name: string,
    value: string,
    options: CookieOptions = {}
): void => {
    const { path = "/", domain, expires, maxAge, secure, sameSite = "Lax" } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}`;

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    if (expires) {
        cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (maxAge) {
        cookieString += `; max-age=${maxAge}`;
    }

    if (secure) {
        cookieString += "; secure";
    }

    cookieString += `; sameSite=${sameSite}`;

    document.cookie = cookieString;
};

// Get a cookie
export const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === decodeURIComponent(name)) {
            return decodeURIComponent(value);
        }
    }
    return null;
};

// Delete a cookie
export const deleteCookie = (name: string, options: CookieOptions = {}): void => {
    setCookie(name, "", { ...options, path: "/", maxAge: -1 });
};
