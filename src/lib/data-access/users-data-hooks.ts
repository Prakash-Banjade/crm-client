import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TUsersResponse } from "../types/user.type";

export const useGetUsers = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<TUsersResponse>>
}) => {
    const response = useFetch<TUsersResponse>({
        endpoint: QueryKey.USERS,
        queryString,
        queryKey: queryString ? [QueryKey.USERS, queryString] : [QueryKey.USERS],
        options,
    })

    return response;
}