"use server";

import { TAdminUserFormSchema } from "../schema/users.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createAdminUser(formData: TAdminUserFormSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: "/users",
        method: "POST",
    })
}

export async function updateAdminUser({ userId, formData }: { userId: string, formData: TAdminUserFormSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: `/users/${userId}`,
        method: "PATCH",
    })
}

export async function deleteAdminUser(userId: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/users/${userId}`,
        method: "DELETE",
    })
}
