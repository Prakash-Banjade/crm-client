import { TUser } from "@/lib/types/user.type";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Lock, MoreHorizontal, Trash, Unlock } from "lucide-react";
import OrganizationUserDeleteDialog from "./organization-user-delete-dialog";
import OrganizationUserBlockAlertDialog from "./organization-user-block-alert-dialog";

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
            const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);

            const [isBlockOpen, setIsBlockOpen] = useState(false);
            const isBlacklisted = row.original.blacklistedAt !== null;



            return (
                <>
                    <OrganizationUserDeleteDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        userId={row.original.userId}
                        userName={row.original.fullName}
                    />

                    <OrganizationUserBlockAlertDialog
                        isOpen={isBlockOpen}
                        setIsOpen={setIsBlockOpen}
                        userId={row.original.userId}
                        userName={row.original.fullName}
                        isBlacklisted={isBlacklisted}
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

                            <DropdownMenuItem className="whitespace-nowrap" onClick={() => setIsBlockOpen(true)}>
                                {isBlacklisted ? <Unlock /> : <Lock />}
                                {isBlacklisted ? "Unblock" : "Block"}
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteConfirmDialogOpen(true)}>
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