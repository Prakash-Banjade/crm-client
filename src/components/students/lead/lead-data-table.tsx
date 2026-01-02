"use client";

import { DataTable } from "../../data-table/data-table";
import { leadsColumns } from "./leads-columns";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { createQueryString } from "@/lib/utils";
import SearchInput, { SEARCH_KEY } from "../../search-components/search-input";
import DataTableLoadingSkeleton from "../../data-table/data-table-loading-skeleton";
import { TLeadsResponse } from "@/lib/types/leads.type";
import { useGetStudents } from "@/lib/data-access/student-data-hooks";

export default function LeadDataTable() {
    const { searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetStudents<TLeadsResponse>({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY),
            page: searchParams.get("page"),
            take: searchParams.get("take"),
            onlyLeads: true,
        }),
    });

    if (isLoading) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            columns={leadsColumns}
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
