"use client";

import { useAxios } from '@/lib/axios-client';
import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';

export type UseFetchOptions<TData> = {
    queryKey: string[],
    endpoint: string;
    queryString?: string,
    options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
}

/**
 * Custom hook to fetch data using React Query.
 * @param {string} queryKey - Unique key for the query.
 * @param {Object} options - Additional options for the useQuery hook.
 * @returns {Object} - Contains data, error, loading status, etc.
 */

export const useFetch = <TData>({
    queryKey,
    options,
    queryString = '',
    endpoint,
}: UseFetchOptions<TData>) => {
    const axios = useAxios();

    const url = `/${endpoint}${queryString ? `?${queryString}` : ''}`;

    return useQuery<TData>({
        queryKey: queryKey,
        queryFn: async () => {
            const response = await axios.get<TData>(url);
            return response.data;
        },
        placeholderData: keepPreviousData,
        ...options,
    });
};
