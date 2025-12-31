"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {  MoreHorizontal, Pencil, Trash, User } from "lucide-react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { ResponsiveAlertDialog } from "../ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { ProfileAvatar } from "../ui/avatar";
import { getObjectUrl } from "@/lib/utils";
import { TBooking } from "@/lib/types/booking.types";
import { deleteBooking } from "@/lib/actions/bookings.action";
import Link from "next/link";

export const bookingColumns: ColumnDef<TBooking>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />;
        },
        cell: ({ row }) => {
            return (

                <span className="font-medium">{row.original.name}</span>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.email}
                </div>
            );
        }
    },
    {
        accessorKey: "phNo",
        header: "Phone",
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.phNo}
                </div>
            );
        }
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {row.original.type}
                </div>
            );
        }
    },
    {
        accessorKey: "subType",
        header: "Sub Type",
        cell: ({ row }) => {
            return (
                <div className="capitalize">
                    {row.original.subType}
                </div>
            );
        }
    },
    {
        accessorKey: "bookingDate",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Booking Date" />
        ),
        cell: ({ row }) => {
            return (
                <div>
                    {new Date(row.original.bookingDate).toLocaleDateString()}
                </div>
            );
        }
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.location}
                </div>
            );
        }
    },
    {
        accessorKey: "dob",
        header: "DOB",
        cell: ({ row }) => {
            return (
                <div>
                    {new Date(row.original.dob).toLocaleDateString()}
                </div>
            );
        }
    },
    {
        accessorKey: "paymentProof",
        header: "Payment Proof",
        cell: ({ row }) => {
            return (
                  <Link className="text-blue-500 hover:underline" rel="noopener noreferrer" target="_blank" href={getObjectUrl(row.original.paymentProof)}>
                  Click to view
                  </Link>
            )
        }
    },
    {
        accessorKey: "passportAttachment",
        header: "Passport Attachment",
        cell: ({ row }) => {
            return (
                  <Link className="text-blue-500 hover:underline" rel="noopener noreferrer" target="_blank" href={getObjectUrl(row.original.passportAttachment)}>
                  Click to view
                  </Link>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return (
                <div>
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
            );
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
                useState(false);

            const { isPending: deletePending, mutate: deleteMutate } =
                useServerAction({
                    action: deleteBooking,
                    invalidateTags: [QueryKey.BOOKINGS],
                    onSuccess: () => {
                        setIsDeleteConfirmDialogOpen(false);
                    },
                });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        title="Delete Booking"
                        description="Are you sure you want to delete this booking?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
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
                                <Link href={`bookings/${row.original.id}`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setIsDeleteConfirmDialogOpen(true)}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];
