"use client";

import { useGetOrganizations } from '@/lib/data-access/organization-data-hooks'
import { DataTable } from '../data-table/data-table';
import { organizationsColumns } from './organization-columns';
import SearchInput from '../search-components/search-input';
import { useSearchParams } from 'next/navigation';

type Props = {}

export default function OrganizationDataTable({ }: Props) {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetOrganizations({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <div>Loading...</div>

    if (!data) return null;

    return (
        <DataTable
            columns={organizationsColumns}
            data={data.data}
            meta={data.meta}
            filters={
                <section>
                    <SearchInput />
                </section>
            }
        />
    )
}