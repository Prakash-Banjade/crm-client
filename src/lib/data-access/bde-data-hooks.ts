import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TBde, TBdesResponse } from "../types/bde.type";

export const useGetBdes = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TBdesResponse>>
}) => {
    const response = useFetch<TBdesResponse>({
        endpoint: QueryKey.BDES,
        queryString,
        queryKey: queryString ? [QueryKey.BDES, queryString] : [QueryKey.BDES],
        options,
    })

    return response;
}

export const useGetBde = ({
    id,
    options,
}: {
    id: string;
    options?: Partial<UseQueryOptions<TBde>>
}) => {
    const response = useFetch<TBde>({
        endpoint: `${QueryKey.BDES}/${id}`,
        queryKey: [QueryKey.BDES, id],
        options,
    })

    return response;
}