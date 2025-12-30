"use client";

import { DataTable } from "@/components/data-table/data-table";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { useSearchParams } from "next/navigation";
import { createQueryString } from "@/lib/utils";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { useGetUniversities } from "@/lib/data-access/university-data-hooks";
import { universitiesColumns } from "./university-columns";

export default function UniversitiesDataTable() {
    const searchParams = useSearchParams();

    const { data, isPending } = useGetUniversities({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY) || "",
        }),
    });

    if (isPending) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            data={data?.data || []}
            columns={universitiesColumns}
            meta={data?.meta}
            filters={
                <div>
                    <SearchInput />
                </div>
            }
            show={{ viewColumn: false }}
        />
    )
}