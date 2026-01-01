"use client";

import SearchInput from '../search-components/search-input';
import { useSearchParams } from 'next/navigation';

import DataTableLoadingSkeleton from '../data-table/data-table-loading-skeleton';
import { DataTable } from '../data-table/data-table';
import { learningResourcesColumns } from './learning-resources-column';
import { useGetLearningResources } from '@/lib/data-access/learning-resources-data-hooks';

export default function LearningResourcesDataTable() {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetLearningResources({
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
            columns={learningResourcesColumns}
            data={data.data}
            meta={data.meta}
        />
    )
}

