import { useFetch } from "@/hooks/useFetch";
import { UseQueryOptions } from "@tanstack/react-query";
import { QueryKey } from "../react-query/queryKeys";
import { TBookingResponse, TSingleBooking } from "../types/booking.types";

export const useGetBookings = ({
    options,
    queryString,
}: {
    options?: Partial<UseQueryOptions<TBookingResponse>>
    queryString?: string
}) => {
    const response = useFetch<TBookingResponse>({
        endpoint: QueryKey.BOOKINGS,
        queryString,
        queryKey: queryString ? [QueryKey.BOOKINGS, queryString] : [QueryKey.BOOKINGS],
        options,
    })

    return response;
}

export const useGetBookingById = ({
    options,
    id,
}: {
    options?: Partial<UseQueryOptions<TSingleBooking>>
    id: string
}) => {
    const response = useFetch<TSingleBooking>({
        endpoint: QueryKey.BOOKINGS + '/' + id,
        queryKey: [QueryKey.BOOKINGS, id],
        options,
    })

    return response;
}