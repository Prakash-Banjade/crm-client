"use client";

import { DataTable } from "@/components/data-table/data-table";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { createQueryString } from "@/lib/utils";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { useGetUniversities } from "@/lib/data-access/university-data-hooks";
import { universitiesColumns } from "./university-columns";
import { CountrySelect } from "../forms/country-select";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

export default function UniversitiesDataTable() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { data, isPending } = useGetUniversities({
        queryString: createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY) || "",
            countryId: searchParams.get("countryId") || "",
            sortBy: searchParams.get("sortBy") || "name",
            order: searchParams.get("order") || "ASC",
        }),
    });

    if (isPending) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            data={data?.data || []}
            columns={universitiesColumns}
            meta={data?.meta}
            filters={
                <div className="flex gap-2">
                    <SearchInput />
                    <CountrySelect
                        value={{
                            value: searchParams.get("countryId") || "",
                            label: searchParams.get("countryName") || "",
                        }}
                        onValueChange={(value) => {
                            setSearchParams({
                                countryId: value.value,
                                countryName: value.label,
                            });
                        }}
                    />
                </div>
            }
        />
    )
}