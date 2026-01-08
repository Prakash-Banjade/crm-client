"use client";

import SearchInput from '../search-components/search-input';
import { useSearchParams } from 'next/navigation';

import DataTableLoadingSkeleton from '../data-table/data-table-loading-skeleton';
import { regionalInchargeColumns } from './regional-incharge-columns';
import { DataTable } from '../data-table/data-table';
import { useGetRegionalIncharges } from '@/lib/data-access/regional-incharge-data-hooks';


export default function RegionalInchargeDataTable() {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetRegionalIncharges({
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
            columns={regionalInchargeColumns}
            data={data.data}
            meta={data.meta}
        />
    )
}




