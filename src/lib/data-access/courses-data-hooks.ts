import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TCoursesResponse, TSingleCourse } from "../types/course.types";

export const useGetCourses = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TCoursesResponse>>
}) => {
    const response = useFetch<TCoursesResponse>({
        endpoint: QueryKey.COURSES,
        queryString,
        queryKey: queryString ? [QueryKey.COURSES, queryString] : [QueryKey.COURSES],
        options,
    })

    return response;
}

export const useGetCourseById = ({
    id,
    options,
}: {
    id: string;
    options?: Partial<UseQueryOptions<TSingleCourse>>
}) => {
    const response = useFetch<TSingleCourse>({
        endpoint: `${QueryKey.COURSES}/${id}`,
        queryKey: [QueryKey.COURSES, id],
        options,
    })

    return response;
}
