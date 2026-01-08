"use client";

import { DataTable } from "@/components/data-table/data-table";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { createQueryString } from "@/lib/utils";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { useGetCounselors } from "@/lib/data-access/counselor-data-hooks";
import { counselorColumns } from "./counselor-columns";
import { useSearchParams } from "next/navigation";

export default function CounselorsDataTable() {
    const searchParams = useSearchParams();

    const { data, isPending } = useGetCounselors({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY),
            sortBy: searchParams.get("sortBy"),
            order: searchParams.get("order"),
        }),
    });

    if (isPending) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            data={data?.data || []}
            columns={counselorColumns}
            meta={data?.meta}
            filters={
                <div className="flex gap-2">
                    <SearchInput />
                </div>
            }
        />
    )
}