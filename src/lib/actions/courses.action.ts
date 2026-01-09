"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TCourseSchema } from "../schema/course.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createCourse(formData: TCourseSchema): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
            categoryId: formData.category?.value,
            universityId: formData.university?.value,
        },
        endpoint: `/${QueryKey.COURSES}`,
        method: "POST",
    })
}

export async function updateCourse({ id, formData }: { id: string, formData: TCourseSchema }): Promise<ActionResponse> {
    return await serverMutate({
        body: {
            ...formData,
            categoryId: formData.category?.value,
            universityId: formData.university?.value,
        },
        endpoint: `/${QueryKey.COURSES}/${id}`,
        method: "PATCH",
    })
}

export async function deleteCourse(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.COURSES}/${id}`,
        method: "DELETE",
    })
}

export async function createCategory({ name }: { name: string }): Promise<ActionResponse> {
    return await serverMutate({
        body: { name },
        endpoint: `/${QueryKey.CATEGORIES}`,
        method: "POST",
    })
}

export async function updateCategory({ name, id }: { name: string, id: string }): Promise<ActionResponse> {
    return await serverMutate({
        body: { name },
        endpoint: `/${QueryKey.CATEGORIES}/${id}`,
        method: "PATCH",
    })
}

export async function deleteCategory(id: string): Promise<ActionResponse> {
    return await serverMutate({
        body: {},
        endpoint: `/${QueryKey.CATEGORIES}/${id}`,
        method: "DELETE",
    })
}
