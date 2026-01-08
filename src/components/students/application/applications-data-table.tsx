"use client";

import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { createQueryString } from "@/lib/utils";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { useGetApplications } from "@/lib/data-access/application-data-hooks";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { applicationColumns } from "./application-columns";


export default function ApplicationsDataTable() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetApplications({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY),
            ...Object.fromEntries(searchParams.entries()),
        }),
    });

    if (isLoading) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            columns={applicationColumns}
            data={data?.data || []}
            meta={data?.meta}
            filters={<SearchFilter />}
        />
    )
}

function SearchFilter() {
    return (
        <section className="flex gap-2">
            <SearchInput placeholder="Search by student name" />
        </section>
    )
}