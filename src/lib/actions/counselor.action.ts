"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TCounselorSchema } from "../schema/counselor.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createCounselor(formData: TCounselorSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.COUNSELORS}`,
        method: "POST",
    })
}

export async function updateCounselor({ id, formData }: { id: string, formData: TCounselorSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.COUNSELORS}/${id}`,
        method: "PATCH",
    })
}

export async function deleteCounselor(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.COUNSELORS}/${id}`,
        method: "DELETE",
    })
}