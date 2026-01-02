import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { TStudent } from "@/lib/types/student.types";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const studentColumns: ColumnDef<TStudent>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "refNo",
        header: "Ref No.",
        cell: ({ row }) => (
            <div className="h-8 flex items-center">
                <Link href={`application/${row.original.id}`}>
                    {row.original.refNo}
                </Link>
            </div>
        ),
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => <Link href={`application/${row.original.id}`} className="capitalize font-medium hover:text-blue-500 hover:underline"> {row.original.fullName} </Link>,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <p> {row.original.createdAt} </p>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <p> {row.original.email} </p>,
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => <p> {row.original.phoneNumber} </p>,
    },
    {
        accessorKey: "createdBy.lowerCasedFullName",
        header: "Created By",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy?.lowerCasedFullName || "N/A";
            return <p className={cn("capitalize", createdBy === "N/A" && "text-muted-foreground")}> {createdBy} </p>;
        },
    },
    {
        accessorKey: "statusMessage",
        header: "Status",
        cell: ({ row }) => <p className={cn(!!row.original.statusMessage && "text-destructive")}> {row.original.statusMessage} </p>,
    },
]