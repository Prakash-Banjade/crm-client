import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { studentStatusMessages, TStudent } from "@/lib/types/student.types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDate } from "date-fns";
import { profileTabs, StudentTabs } from "./single-student-form";

export const studentColumns: ColumnDef<TStudent>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "refNo",
        header: "Ref No.",
        cell: ({ row }) => {
            /** based on status message, redirect to the appropriate tab */
            const statusMessage = row.original.statusMessage;
            const link = statusMessage === studentStatusMessages.personalInfo
                ? `application/${row.original.id}?tab=${StudentTabs.Profile}&subTab=${profileTabs[0].value}`
                : statusMessage === studentStatusMessages.academicQualification
                    ? `application/${row.original.id}?tab=${StudentTabs.Profile}&subTab=${profileTabs[1].value}`
                    : statusMessage === studentStatusMessages.documents
                        ? `application/${row.original.id}?tab=${StudentTabs.Documents}`
                        : `application/${row.original.id}?tab=${StudentTabs.Applications}`;

            return (
                <div className="h-8 flex items-center">
                    <Link href={link}>
                        {row.original.refNo}
                    </Link>
                </div>
            )
        },
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            /** based on status message, redirect to the appropriate tab */
            const statusMessage = row.original.statusMessage;
            const link = statusMessage === studentStatusMessages.personalInfo
                ? `application/${row.original.id}?tab=${StudentTabs.Profile}&subTab=${profileTabs[0].value}`
                : statusMessage === studentStatusMessages.academicQualification
                    ? `application/${row.original.id}?tab=${StudentTabs.Profile}&subTab=${profileTabs[1].value}`
                    : statusMessage === studentStatusMessages.documents
                        ? `application/${row.original.id}?tab=${StudentTabs.Documents}`
                        : `application/${row.original.id}?tab=${StudentTabs.Applications}`;

            return (
                <Link href={link} className="capitalize font-medium hover:text-blue-500 hover:underline"> {row.original.fullName} </Link>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <p> {formatDate(row.original.createdAt, "dd/MM/yyyy HH:mm")} </p>,
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
        cell: ({ row }) => {
            const message = row.original.statusMessage;
            const applicatiosCount = row.original.applicationsCount;

            return (
                <p className={cn("italic", !!message ? "text-destructive" : applicatiosCount > 0 ? "text-green-600" : "text-muted-foreground")}> {message.length > 0 ? message : applicatiosCount > 0 ? `${applicatiosCount} Application(s)` : "No application submitted"} </p>
            )
        },
    },
]