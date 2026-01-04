"use client";

import { useGetUsers } from "@/lib/data-access/users-data-hooks";
import { organizationUsersColumns } from "./organization-users-columns";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import AdminUserForm from "./admin-user-form";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { cn, createQueryString } from "@/lib/utils";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

type Props = {
    organizationId: string;
}

export default function OrganizationUsersDataTable({ organizationId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add Admin"
                confirmOnExit={isFormDirty}
            >
                <AdminUserForm setIsOpen={setIsOpen} organizationId={organizationId} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <div className="space-y-4">
                <header className="flex justify-between">
                    <h3 className="text-xl font-medium">
                        Users
                    </h3>
                    <Button variant={"outline"} onClick={() => setIsOpen(true)}>
                        <Plus /> Add Admin
                    </Button>
                </header>
                <UsersDataTable organizationId={organizationId} />
            </div>
        </>
    )
}

function UsersDataTable({ organizationId }: { organizationId: string }) {

    const searchParams = useSearchParams();

    const { data, isPending } = useGetUsers({
        queryString: createQueryString({
            organizationId,
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY) || "",
        }),
    });
    const table = useReactTable({
        data: data?.data || [],
        columns: organizationUsersColumns,
        getCoreRowModel: getCoreRowModel(),
    })
    if (isPending) return <DataTableLoadingSkeleton />;
if(!data) return null;
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
                                <TableCell colSpan={organizationUsersColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination meta={data.meta} table={table} />
        </div>
    )
}