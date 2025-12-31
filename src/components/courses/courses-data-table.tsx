"use client";

import { useGetCourses } from "@/lib/data-access/courses-data-hooks";
import { DataTable } from "../data-table/data-table";
import { coursesColumns } from "./courses-columns";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { createQueryString } from "@/lib/utils";
import SearchInput, { SEARCH_KEY } from "../search-components/search-input";
import DataTableLoadingSkeleton from "../data-table/data-table-loading-skeleton";

export default function CoursesDataTable() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetCourses({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY),
        }),
    });

    if (isLoading) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            columns={coursesColumns}
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