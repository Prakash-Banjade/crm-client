"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, User } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useState } from "react"
import { TRegionalIncharge } from "@/lib/types/regional-incharge.types";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import RegionalInchargeForm from "./regional-incharge-form";
import { ResponsiveAlertDialog } from "../ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { deleteUser } from "@/lib/actions/user.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { ProfileAvatar } from "../ui/avatar";
import { getObjectUrl } from "@/lib/utils";
import { deleteRegionalIncharge } from "@/lib/actions/regional-incharge.action";


export const regionalInchargeColumns: ColumnDef<TRegionalIncharge>[] = [
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
            return <div className="hover:text-blue-500 hover:underline flex gap-4 items-center w-fit">
                {
                    row.original.profileImage ? (
                        <ProfileAvatar
                            name={row.original.name}
                            src={getObjectUrl(row.original.profileImage)}
                            className="size-10"
                        />
                    ) : (
                        <div className="size-10 grid place-items-center">
                            <User className="size-8" />
                        </div>
                    )
                }
                <span className="font-medium">{row.original.name}</span>
            </div>
        }
    },
    {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
            const email = row.original.email;

            return email.length > 0 ? (
                <a href={`mailto:${row.original.email}`} className="hover:text-blue-500 hover:underline">{row.original.email}</a>
            ) : "-"
        },
    },
    {
        header: "Phone",
        accessorKey: "Phone",
        cell: ({ row }) => {
            const contactNumber = row.original.phone;

            return contactNumber.length > 0 ? (
                <a href={`tel:${contactNumber}`} className="hover:text-blue-500 hover:underline">{contactNumber}</a>
            ) : "-"
        }
    },

    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {

            const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);

            const [isEditing, setIsEditing] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
                action: deleteRegionalIncharge,
                invalidateTags: [QueryKey.REGIONAL_INCHARGES],
                onSuccess: () => {
                    setIsDeleteConfirmDialogOpen(false);
                }
            });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        title="Delete Regional incharge"
                        description="Are you sure you want to delete this regional incharge?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
                    />
                    <ResponsiveDialog
                        isOpen={isEditing}
                        setIsOpen={setIsEditing}
                        title="Edit Regional Incharge"
                    >
                        <RegionalInchargeForm defaultValues={row.original} setIsOpen={setIsEditing} />
                    </ResponsiveDialog>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setIsEditing(true)} >
                                <Pencil />
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem variant="destructive"
                                onClick={() => setIsDeleteConfirmDialogOpen(true)}
                            >
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
