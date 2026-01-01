"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
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
import { TLearningResource } from "@/lib/types/learning-resources.types";
import { deleteLearningResource } from "@/lib/actions/learning-resources.action";
import LearningResourcesForm from "./learning-resource-form";
import Link from "next/link";

export const learningResourcesColumns: ColumnDef<TLearningResource>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "title",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Title" />;
        },
        cell: ({ row }) => {
            return (
                <Link href={`/super_admin/learning-resources/${row.original.id}`}>
                    <span className="font-medium">{row.original.title}</span>
                </Link>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);

            const [isEditing, setIsEditing] = useState(false);
            const [isEditFormDirty, setIsEditFormDirty] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
                action: deleteLearningResource,
                invalidateTags: [QueryKey.LEARNING_RESOURCES],
                onSuccess: () => {
                    setIsDeleteConfirmDialogOpen(false);
                },
            });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        title="Delete Learning Resource"
                        description="Are you sure you want to delete this learning resource?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
                    />
                    <ResponsiveDialog
                        isOpen={isEditing}
                        setIsOpen={setIsEditing}
                        title="Edit Learning Resource"
                        confirmOnExit={isEditFormDirty}
                    >
                        <LearningResourcesForm
                            defaultValues={{ ...row.original, parentId: row.original.parent?.id || null }}
                            setIsOpen={setIsEditing}
                            setIsFormDirty={setIsEditFormDirty}
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
