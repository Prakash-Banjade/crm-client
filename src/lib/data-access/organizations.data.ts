"use client";

import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { SelectOption } from "../types";
import { useFetch } from "@/hooks/useFetch";

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
