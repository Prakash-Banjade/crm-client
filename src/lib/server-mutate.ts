import { serverFetch } from "./server-fetch";
import { ActionResponse } from "./types";
import { extractErrorMessage } from "./utils";

export async function serverMutate({
    endpoint,
    method,
    body,
}: {
    endpoint: string;
    method: "POST" | "PATCH" | "DELETE";
    body: any;
}): Promise<ActionResponse> {
    const res = await serverFetch(endpoint, {
        method, 
        body: JSON.stringify(body),
        cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        const message = extractErrorMessage(data);
        return {
            success: false,
            error: {
                message: message.message,
                error: message.error
            }
        }
    }

    return {
        success: true,
        data,
    };
}