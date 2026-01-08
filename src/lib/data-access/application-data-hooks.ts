import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TApplicationMessage, TApplicationsResponse, TSingleApplication } from "../types/application.type";

export const useGetApplications = <T = TApplicationsResponse>({
    queryString,
    options,
}: {
    queryString?: string;
    options?: Partial<UseQueryOptions<T>>
}) => {
    const response = useFetch<T>({
        endpoint: QueryKey.APPLICATIONS,
        queryString,
        queryKey: queryString ? [QueryKey.APPLICATIONS, queryString] : [QueryKey.APPLICATIONS],
        options,
    })

    return response;
}

export const useGetApplication = ({
    id,
    options,
}: {
    id: string;
    options?: Partial<UseQueryOptions<TSingleApplication>>
}) => {
    const response = useFetch<TSingleApplication>({
        endpoint: `${QueryKey.APPLICATIONS}/${id}`,
        queryKey: [QueryKey.APPLICATIONS, id],
        options,
    })

    return response;
}

export const useGetMessages = ({
    conversationId,
    options,
}: {
    conversationId: string;
    options?: Partial<UseQueryOptions<TApplicationMessage[]>>
}) => {
    const response = useFetch<TApplicationMessage[]>({
        endpoint: `${QueryKey.MESSAGES}/${conversationId}`,
        queryKey: [QueryKey.MESSAGES, conversationId],
        options,
    })

    return response;
}