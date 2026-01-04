import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDate } from "date-fns";
import { EApplicationPriority, TApplication } from "@/lib/types/application.type";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { StudentTabs } from "../single-student-form";

export const applicationColumns: ColumnDef<TApplication>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "ackNo",
        header: "ACK No.",
        cell: ({ row }) => (
            <div className="h-8 flex items-center">
                <Link href={`students/application/${row.original.student.id}?tab=${StudentTabs.Applications}&applicationId=${row.original.id}`}>
                    {row.original.ackNo}
                </Link>
            </div>
        ),
    },
    {
        accessorKey: "student.fullName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            return (
                <Link href={`students/application/${row.original.student.id}?tab=${StudentTabs.Applications}&applicationId=${row.original.id}`} className="capitalize font-medium hover:text-blue-500 hover:underline"> {row.original.student.fullName} </Link>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <p> {formatDate(row.original.createdAt, "dd/MM/yyyy HH:mm")} </p>,
    },
    {
        accessorKey: "course.university.name",
        header: "University",
        cell: ({ row }) => <p> {row.original.course.university.name} </p>,
    },
    {
        accessorKey: "course.name",
        header: "Program",
        cell: ({ row }) => <p> {row.original.course.name} </p>,
    },
    {
        accessorKey: "intake",
        header: "Intake",
        cell: ({ row }) => <p className="capitalize">{row.original.intake} - {row.original.year} </p>,
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const p = row.original.priority;
            return (
                <Badge
                    variant={
                        p === EApplicationPriority.High
                            ? "destructive"
                            : p === EApplicationPriority.Medium
                                ? "warning"
                                : p === EApplicationPriority.Low
                                    ? "success"
                                    : "outline"
                    }
                    className="capitalize text-sm"
                >
                    {p}
                </Badge>
            )
        },
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <p className="capitalize font-medium">{status.split("_").join(" ")}</p>
            )
        },
    },
]