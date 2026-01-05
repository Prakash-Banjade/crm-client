"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TApplicationMessageSchema, TCreateApplicationSchema, TUpdateApplicationSchema } from "../schema/application.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createApplication(formData: TCreateApplicationSchema): Promise<ActionResponse<{ applicationId: string, message: string }>> {
    return await serverMutate({
        body: {
            ...formData,
            universityId: formData.university.value,
            courseId: formData.course.value,
            year: +formData.year,
        },
        endpoint: `/${QueryKey.APPLICATIONS}`,
        method: "POST",
    })
}

export async function updateApplication({ id, formData }: { id: string, formData: TUpdateApplicationSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.APPLICATIONS}/${id}`,
        method: "PATCH",
    })
}

export async function verifyPaymentDocument({ id }: { id: string }): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.APPLICATIONS}/${id}/payment-verify`,
        method: "PATCH",
    })
}

export async function deleteApplication(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.APPLICATIONS}/${id}`,
        method: "DELETE",
    })
}

export async function sendMessage({ formData }: { formData: TApplicationMessageSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
            files: formData.files.map(file => file.fileName),
        },
        endpoint: `/${QueryKey.MESSAGES}`,
        method: "POST",
    })
}

