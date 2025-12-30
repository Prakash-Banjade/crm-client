"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { PaginatedResponse, SelectOption, TPaginatedOptions } from "@/lib/types"
import { useAxios } from "@/lib/axios-client"

const emptyPaginatedData: TPaginatedOptions = {
    data: [],
    meta: {
        hasNextPage: false,
        hasPreviousPage: false,
        page: 1,
        itemCount: 0,
        pageCount: 1,
        take: 0,
    }
}

export function useInfiniteOptions<T = SelectOption>(endpoint: string, queryString = "") {
    const axios = useAxios();

    const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, refetch } = useInfiniteQuery({
        queryKey: [endpoint, queryString],
        queryFn: async ({ pageParam }) => {
            const url = endpoint + `?page=${pageParam}&` + queryString;
            const response = await axios.get<PaginatedResponse<T>>(url);
            return response.data ?? emptyPaginatedData;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined
        },
        enabled: true,
    });

    // Flatten all pages into a single array of options
    const options = useMemo(() => {
        return data?.pages.flatMap((page) => page.data) ?? []
    }, [data])

    // Get total count from the first page
    const totalCount = data?.pages[0]?.meta.itemCount ?? 0

    return {
        options,
        totalCount,
        error: error as Error | null,
        fetchNextPage,
        hasNextPage: !!hasNextPage,
        isLoading: status === "pending",
        isFetching,
        isFetchingNextPage,
        refetch,
    }
}
