"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TUniversitySchema } from "../schema/university.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createUniversity(formData: TUniversitySchema): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
            countryId: formData.country?.id,
        },
        endpoint: `/${QueryKey.UNIVERSITIES}`,
        method: "POST",
    })
}

export async function updateUniversity({ id, formData }: { id: string, formData: TUniversitySchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
            countryId: formData.country?.id,
        },
        endpoint: `/${QueryKey.UNIVERSITIES}/${id}`,
        method: "PATCH",
    })
}

export async function deleteUniversity(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.UNIVERSITIES}/${id}`,
        method: "DELETE",
    })
}