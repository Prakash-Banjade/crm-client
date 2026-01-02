import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../data-table/data-table-column-header";
import { TLead } from "@/lib/types/leads.type";
import { useState } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import AddLeadForm from "./lead-form";
import { deleteStudent } from "@/lib/actions/student.action";

export const leadsColumns: ColumnDef<TLead>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "fullName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => <p className="capitalize font-medium"> {row.original.firstName} {row.original.lastName} </p>,
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
        accessorKey: "asLead.gender",
        header: "Gender",
        cell: ({ row }) => <p className="capitalize"> {row.original.asLead?.gender || 'N/A'} </p>,
    },
    {
        accessorKey: "asLead.country",
        header: "Country",
        cell: ({ row }) => <p> {row.original.asLead?.country || 'N/A'} </p>,
    },
    {
        accessorKey: "asLead.address",
        header: "Address",
        cell: ({ row }) => <p> {row.original.asLead?.address || 'N/A'} </p>,
    },
    {
        accessorKey: "asLead.interestedCourse",
        header: "Interested Course",
        cell: ({ row }) => <p> {row.original.asLead?.interestedCourse || 'N/A'} </p>,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            return <p> {new Date(row.original.createdAt).toLocaleDateString()} </p>
        },
    },
     {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
                    useState(false);
    
                const [isEditing, setIsEditing] = useState(false);
                const [isEditFormDirty, setIsEditFormDirty] = useState(false);
    
                const { isPending: deletePending, mutate: deleteMutate } =
                    useServerAction({
                        action: deleteStudent,
                        invalidateTags: [QueryKey.STUDENTS],
                        onSuccess: () => {
                            setIsDeleteConfirmDialogOpen(false);
                        },
                    });
    
                return (
                    <>
                        <ResponsiveAlertDialog
                            isOpen={isDeleteConfirmDialogOpen}
                            setIsOpen={setIsDeleteConfirmDialogOpen}
                            title="Delete Lead"
                            description="Are you sure you want to delete this lead?"
                            action={() => deleteMutate(row.original.id)}
                            actionLabel="Yes, Delete"
                            isLoading={deletePending}
                        />
                        <ResponsiveDialog
                            isOpen={isEditing}
                            setIsOpen={setIsEditing}
                            title="Edit Lead"
                            confirmOnExit={isEditFormDirty}
                        >
                            <AddLeadForm
                                defaultValues={row.original}
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
]
