import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { SelectOption } from "../types";
import { useFetch } from "@/hooks/useFetch";
import { TOrganizationsResponse, TSingleOrganization } from "../types/organization.type";

export const useGetOrganizations = ({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<TOrganizationsResponse>>
    queryString?: string
}) => {
    const response = useFetch<TOrganizationsResponse>({
        endpoint: QueryKey.ORGANIZATIONS,
        queryString,
        queryKey: queryString ? [QueryKey.ORGANIZATIONS, queryString] : [QueryKey.ORGANIZATIONS],
        options,
    })

    return response;
}

export const useGetOrganizationOptions = ({
    options,
}: {
    options?: Partial<UseQueryOptions<SelectOption[]>>
}) => {
    const response = useFetch<SelectOption[]>({
        endpoint: QueryKey.ORGANIZATIONS + '/' + QueryKey.OPTIONS,
        queryKey: [QueryKey.ORGANIZATIONS, QueryKey.OPTIONS],
        options,
    })

    return response;
}

export const useGetOrganizationById = ({
    options,
    id,
}: {
    options?: Partial<UseQueryOptions<TSingleOrganization>>
    id: string
}) => {
    const response = useFetch<TSingleOrganization>({
        endpoint: QueryKey.ORGANIZATIONS + '/' + id,
        queryKey: [QueryKey.ORGANIZATIONS, id],
        options,
    })

    return response;
}