import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TLearningResourcesResponse, TSingleLearningResource } from "../types/learning-resources.types";

export const useGetLearningResources = ({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<TLearningResourcesResponse>>
    queryString?: string
}) => {
    const response = useFetch<TLearningResourcesResponse>({
        endpoint: QueryKey.LEARNING_RESOURCES,
        queryString,
        queryKey: queryString ? [QueryKey.LEARNING_RESOURCES, queryString] : [QueryKey.LEARNING_RESOURCES],
        options,
    })
    return response;
}
export const useGetLearningResource = ({
    options,
    id,
}: {
    options?: Partial<UseQueryOptions<TSingleLearningResource>>
    id: string
}) => {
    const response = useFetch<TSingleLearningResource>({
        endpoint: `${QueryKey.LEARNING_RESOURCES}/${id}`,
        queryKey: [QueryKey.LEARNING_RESOURCES, id],
        options,
    })
    return response;
}


