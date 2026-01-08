import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { TRegionalInchargeResponse } from "../types/regional-incharge.types";
import { QueryKey } from "../react-query/queryKeys";

export const useGetRegionalIncharges = ({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<TRegionalInchargeResponse>>
    queryString?: string
}) => {
    const response = useFetch<TRegionalInchargeResponse>({
        endpoint: QueryKey.REGIONAL_INCHARGES,
        queryString,
        queryKey: queryString ? [QueryKey.REGIONAL_INCHARGES, queryString] : [QueryKey.REGIONAL_INCHARGES],
        options,
    })

    return response;
}