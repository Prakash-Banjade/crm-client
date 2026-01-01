import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TStudent, TStudentsResponse } from "../types/student.types";

export const useGetStudents = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TStudentsResponse>>
}) => {
    const response = useFetch<TStudentsResponse>({
        endpoint: QueryKey.STUDENTS,
        queryString,
        queryKey: queryString ? [QueryKey.STUDENTS, queryString] : [QueryKey.STUDENTS],
        options,
    })

    return response;
}

export const useGetStudent = ({
    id,
    options,
}: {
    id: string;
    options?: Partial<UseQueryOptions<TStudent>>
}) => {
    const response = useFetch<TStudent>({
        endpoint: `${QueryKey.STUDENTS}/${id}`,
        queryKey: [QueryKey.STUDENTS, id],
        options,
    })

    return response;
}