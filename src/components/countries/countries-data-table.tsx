"use client";

import SearchInput from '../search-components/search-input';
import { useSearchParams } from 'next/navigation';

import DataTableLoadingSkeleton from '../data-table/data-table-loading-skeleton';
import { DataTable } from '../data-table/data-table';
import { countriesColumns } from './countries-column';
import { useGetCountries } from '@/lib/data-access/countries-data-hooks';


export default function CountriesDataTable() {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetCountries({
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
            columns={countriesColumns}
            data={data.data}
            meta={data.meta}
        />
    )
}




