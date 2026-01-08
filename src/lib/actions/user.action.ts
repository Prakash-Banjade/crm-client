"use server";

import { revalidatePath } from "next/cache";
import { TAdminUserFormSchema } from "../schema/users.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";
import { extractErrorMessage } from "../utils";
import { serverFetch } from "../server-fetch";

export async function createAdminUser(formData: TAdminUserFormSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: "/users",
        method: "POST",
    })
}

export async function updateUser({ userId, formData }: { userId: string, formData: TAdminUserFormSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: `/users/${userId}`,
        method: "PATCH",
    })
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/users/${userId}`,
        method: "DELETE",
    })
}


export async function blockUser(userId: string): Promise<ActionResponse> {
    const res = await serverFetch(`/users/blacklist/${userId}`, {
        method: "PATCH",
        cache: 'no-store',
        body: JSON.stringify({}),
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