import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import { TBde } from "@/lib/types/bde.type";
import { deleteBde } from "@/lib/actions/bde.action";
import BdeForm from "./bde-form";
import Link from "next/link";

export const bdeColumns: ColumnDef<TBde>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "account.firstName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            return (
                <Link href={`bdes/${row.original.id}`} className="capitalize font-medium hover:underline hover:text-blue-500">
                    {row.original.account.firstName} {row.original.account.lastName}
                </Link>
            )
        },
    },
    {
        accessorKey: "account.email",
        header: "Email",
        cell: ({ row }) => <p> {row.original.account.email} </p>,
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => <p> {row.original.phoneNumber} </p>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isEditFormDirty, setIsEditFormDirty] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
                action: deleteBde,
                invalidateTags: [QueryKey.BDES],
                onSuccess: () => {
                    setIsDeleteOpen(false);
                }
            });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete BDE"
                        description="Are you sure you want to delete this BDE?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
                    />

                    <ResponsiveDialog
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                        title="Edit BDE"
                        confirmOnExit={isEditFormDirty}
                        className='sm:min-w-2xl'
                    >
                        <BdeForm
                            setIsOpen={setIsEditOpen}
                            setIsFormDirty={setIsEditFormDirty}
                            defaultValues={{
                                ...row.original,
                                firstName: row.original.account.firstName,
                                lastName: row.original.account.lastName,
                                email: row.original.account.email,
                            }}
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
                            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                <Pencil />
                                Edit
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