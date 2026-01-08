import { TUser } from "@/lib/types/user.type";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash } from "lucide-react";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { deleteUser } from "@/lib/actions/user.action";

export const organizationUsersColumns: ColumnDef<TUser>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => <p className="capitalize font-medium"> {row.original.fullName} </p>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <p> {row.original.email} </p>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <p className="capitalize"> {row.original.role} </p>,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <p> {formatDate(row.original.createdAt, "dd/MM/yyyy")} </p>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
                action: deleteUser,
                invalidateTags: [QueryKey.USERS],
                onSuccess: () => {
                    setIsDeleteOpen(false);
                }
            });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete User"
                        description="Are you sure you want to delete this user?"
                        action={() => deleteMutate(row.original.userId)}
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