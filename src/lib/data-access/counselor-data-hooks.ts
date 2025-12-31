import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TCounselorsResponse } from "../types/counselor.type";

export const useGetCounselors = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TCounselorsResponse>>
}) => {
    const response = useFetch<TCounselorsResponse>({
        endpoint: QueryKey.COUNSELORS,
        queryString,
        queryKey: queryString ? [QueryKey.COUNSELORS, queryString] : [QueryKey.COUNSELORS],
        options,
    })

    return response;
}