"use client";

import { useGetOrganizations } from '@/lib/data-access/organization-data-hooks'
import { organizationsColumns } from './organization-columns';
import SearchInput from '../search-components/search-input';
import { useSearchParams } from 'next/navigation';
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TOrganizationsResponse } from '@/lib/types/organization.type';
import { DataTableToolbar } from '../data-table/data-table-toolbar';
import { DataTablePagination } from '../data-table/data-table-pagination';
import { cn } from '@/lib/utils';
import DataTableLoadingSkeleton from '../data-table/data-table-loading-skeleton';

export default function OrganizationDataTable() {
    const searchParams = useSearchParams();

    const { data, isLoading } = useGetOrganizations({
        queryString: searchParams.toString(),
    });

    if (isLoading) return <DataTableLoadingSkeleton />

    if (!data) return null;

    return (
        <DataTable data={data.data} meta={data.meta} />
    )
}

function DataTable({
    data,
    meta,
}: TOrganizationsResponse) {
    const table = useReactTable({
        data,
        columns: organizationsColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div>
            <DataTableToolbar table={table}>
                <section>
                    <SearchInput />
                </section>
            </DataTableToolbar>
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-accent/20">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-accent/20">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="font-bold">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={cn(!!row.original.blacklistedAt && "bg-destructive/10 hover:bg-destructive/20 text-destructive")}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={organizationsColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination meta={meta} table={table} />
        </div>
    )
}
