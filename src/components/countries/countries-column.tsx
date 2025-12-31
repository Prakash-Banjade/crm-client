"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, User } from "lucide-react";
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
import { TCountry } from "@/lib/types/countries.types";
import CountriesForm from "./countries-form";
import { deleteCountry } from "@/lib/actions/countries.action";

export const countriesColumns: ColumnDef<TCountry>[] = [
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
                <div className="hover:text-blue-500 hover:underline flex gap-4 items-center w-fit">
                    {row.original.flag ? (
                        <ProfileAvatar
                            name={row.original.name}
                            src={getObjectUrl(row.original.flag)}
                            className="size-10"
                        />
                    ) : (
                        <div className="size-10 grid place-items-center">
                            <User className="size-8" />
                        </div>
                    )}
                    <span className="font-medium">{row.original.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "states",
        header: 'States',
        cell: ({ row }) => {
            return (
                <div>
                    {row.original.states?.length ? (
                        <ol className="list-decimal list-inside space-y-1">
                            {row.original.states.map((state, index) => (
                                <li key={index}>{state}</li>
                            ))}
                        </ol>
                    ) : (
                        <span className="text-muted-foreground">No states</span>
                    )}
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

            const [isEditing, setIsEditing] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } =
                useServerAction({
                    action: deleteCountry,
                    invalidateTags: [QueryKey.COUNTRIES],
                    onSuccess: () => {
                        setIsDeleteConfirmDialogOpen(false);
                    },
                });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        title="Delete Country"
                        description="Are you sure you want to delete this country?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
                    />
                    <ResponsiveDialog
                        isOpen={isEditing}
                        setIsOpen={setIsEditing}
                        title="Edit Country"
                    >
                        <CountriesForm
                            defaultValues={row.original}
                            setIsOpen={setIsEditing}
                        />
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
                            <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                <Pencil />
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setIsDeleteConfirmDialogOpen(true)}
                            >
                                <Trash />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            );
        },
    },
];
