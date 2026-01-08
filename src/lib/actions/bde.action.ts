"use server";

import { QueryKey } from "../react-query/queryKeys";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";
import { TBdeSchema } from "../schema/bde.schema";

export async function createBde(formData: TBdeSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.BDES}`,
        method: "POST",
    })
}

export async function updateBde({ id, formData }: { id: string, formData: TBdeSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.BDES}/${id}`,
        method: "PATCH",
    })
}

export async function deleteBde(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.BDES}/${id}`,
        method: "DELETE",
    })
}