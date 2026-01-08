"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TRegionalInchargeSchema } from "../schema/regional-incharge.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createRegionalIncharge(formData: TRegionalInchargeSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: `/${QueryKey.REGIONAL_INCHARGES}`,
        method: "POST",
    })
}

export async function updateRegionalIncharge({ id, formData }: { id: string, formData: TRegionalInchargeSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: formData,
        endpoint: `/${QueryKey.REGIONAL_INCHARGES}/${id}`,
        method: "PATCH",
    })
}

export async function deleteRegionalIncharge(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.REGIONAL_INCHARGES}/${id}`,
        method: "DELETE",
    })
}