"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TStudentSchema } from "../schema/student.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createStudent(formData: TStudentSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.STUDENTS}`,
        method: "POST",
    })
}

export async function updateStudent({ id, formData }: { id: string, formData: TStudentSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
        },
        endpoint: `/${QueryKey.STUDENTS}/${id}`,
        method: "PATCH",
    })
}

export async function deleteStudent(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.STUDENTS}/${id}`,
        method: "DELETE",
    })
}