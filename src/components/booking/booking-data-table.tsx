"use client";

import SearchInput from '../search-components/search-input';
import { useSearchParams } from 'next/navigation';

import DataTableLoadingSkeleton from '../data-table/data-table-loading-skeleton';
import { DataTable } from '../data-table/data-table';
import { bookingColumns } from './booking-column';
import { useGetBookings } from '@/lib/data-access/bookings-data-hooks';



export default function BookingDataTable() {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetBookings({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <DataTableLoadingSkeleton />

    if (!data) return null;

    return (
        <DataTable
            filters={
                <div>
                    <SearchInput />
                </div>
            }
            columns={bookingColumns}
            data={data.data}
            meta={data.meta}
        />
    )
}




