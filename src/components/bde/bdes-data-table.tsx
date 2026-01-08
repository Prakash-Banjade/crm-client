"use client";

import { DataTable } from "@/components/data-table/data-table";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { createQueryString } from "@/lib/utils";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { useGetBdes } from "@/lib/data-access/bde-data-hooks";
import { useSearchParams } from "next/navigation";
import { bdeColumns } from "./bde-columns";

export default function BdesDataTable() {
    const searchParams = useSearchParams();

    const { data, isPending } = useGetBdes({
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
            columns={bdeColumns}
            meta={data?.meta}
            filters={
                <div className="flex gap-2">
                    <SearchInput />
                </div>
            }
        />
    )
}