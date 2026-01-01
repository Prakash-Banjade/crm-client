"use client";

import { useGetStudents } from "@/lib/data-access/student-data-hooks";
import { DataTable } from "../data-table/data-table";
import { studentColumns } from "./student-columns";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { createQueryString } from "@/lib/utils";
import SearchInput, { SEARCH_KEY } from "../search-components/search-input";
import DataTableLoadingSkeleton from "../data-table/data-table-loading-skeleton";

export default function StudentsDataTable() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetStudents({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY),
        }),
    });

    if (isLoading) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            columns={studentColumns}
            data={data?.data || []}
            meta={data?.meta}
            filters={
                <section className="flex gap-2">
                    <SearchInput />
                </section>
            }
        />
    )
}