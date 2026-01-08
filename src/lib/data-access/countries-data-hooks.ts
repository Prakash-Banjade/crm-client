import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TCountriesResponse } from "../types/countries.types";

export const useGetCountries = ({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<TCountriesResponse>>
    queryString?: string
}) => {
    const response = useFetch<TCountriesResponse>({
        endpoint: QueryKey.COUNTRIES,
        queryString,
        queryKey: queryString ? [QueryKey.COUNTRIES, queryString] : [QueryKey.COUNTRIES],
        options,
    })

    return response;
}