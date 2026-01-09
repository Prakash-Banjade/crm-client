"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useState } from "react"
import { TCourse } from "@/lib/types/course.types";
import { ResponsiveAlertDialog } from "../ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { deleteCourse } from "@/lib/actions/courses.action";
import { QueryKey } from "@/lib/react-query/queryKeys";

export const coursesColumns: ColumnDef<TCourse>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            return <Link href={`courses/${row.original.id}`} className="hover:text-blue-500 hover:underline flex gap-4 items-center w-fit">
                <span className="font-medium">{row.original.name}</span>
            </Link>
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
            return <span>{row.original.duration} Months</span>;
        },
    },
    {
        accessorKey: "university",
        header: "University",
        cell: ({ row }) => {
            return row.original.university?.name;
        },
    },
    {
        accessorKey: "country",
        header: "Campus",
        cell: ({ row }) => {
            const country = row.original.university?.country?.name;
            const state = row.original.university?.state;
            return `${state}, ${country}`;
        },
    },
    {
        accessorKey: "fee",
        header: "Fee",
        cell: ({ row }) => {
            const fee = row.original.fee?.toLocaleString();
            const currency = row.original.currency;

            return (
                <span>
                    {currency} {fee}
                </span>
            );
        },
    },
    {
        accessorKey: "applicationFee",
        header: "Application Fee",
        cell: ({ row }) => {
            const applicationFee = row.original.applicationFee?.toLocaleString();
            const currency = row.original.currency;

            return (
                <span>
                    {currency} {applicationFee}
                </span>
            );
        },
    },
    {
        accessorKey: "gapAccepted",
        header: "Gap Accepted",
        cell: ({ row }) => {
            const gapAccepted = row.original.gapAccepted;

            return <span>{gapAccepted} years</span>;
        },
    },
    {
        accessorKey: "ieltsOverall",
        header: "IELTS Overall",
        cell: ({ row }) => {
            const ieltsOverall = row.original.ieltsOverall;

            return <div>{ieltsOverall} </div>;
        },
    },
    {
        accessorKey: "pteOverall",
        header: "PTE Overall",
        cell: ({ row }) => {
            const pteOverall = row.original.pteOverall;

            return <div>{pteOverall} </div>;
        },
    },
    {
        accessorKey: "courseUrl",
        header: () => (<span className="whitespace-nowrap">Course URL</span>),
        cell: ({ row }) => {
            const url = row.original.courseUrl;

            return (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline whitespace-nowrap"
                >
                    Click to view
                </a>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
                action: deleteCourse,
                invalidateTags: [QueryKey.COURSES],
                onSuccess: () => {
                    setIsDeleteOpen(false);
                }
            });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete Course"
                        description="Are you sure you want to delete this course?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
                        loadingText="Deleting..."
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`courses/${row.original.id}`}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                                <Trash />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]
