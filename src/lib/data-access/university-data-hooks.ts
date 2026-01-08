import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TUniversitiesResponse } from "../types/university.type";

export const useGetUniversities = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TUniversitiesResponse>>
}) => {
    const response = useFetch<TUniversitiesResponse>({
        endpoint: QueryKey.UNIVERSITIES,
        queryString,
        queryKey: queryString ? [QueryKey.UNIVERSITIES, queryString] : [QueryKey.UNIVERSITIES],
        options,
    })

    return response;
}