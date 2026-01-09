"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Lock, MoreHorizontal, Pencil, Trash, Unlock } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TOrganization } from "@/lib/types/organization.type"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useState } from "react"
import { formatDate } from "date-fns";
import OrganizationDeleteDialog from "./organization-delete-dialog";
import OrganizationBlockAlertDialog from "./organization-block-alert-dialog";
import { useAuth } from "@/context/auth-provider";
import { Role } from "@/lib/types";

export const organizationsColumns: ColumnDef<TOrganization>[] = [
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
            return <Link href={`/organizations/${row.original.id}`} className="hover:text-blue-500 hover:underline flex gap-4 items-center w-fit">
                {/* <ProfileAvatar
                    name={row.original.name}
                    src={getImageUrl(row.original.profileImageUrl, "w=40")}
                    className="size-10"
                /> */}
                <span className="font-medium">{row.original.name}</span>
            </Link>
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
        header: "Contact Number",
        accessorKey: "contactNumber",
        cell: ({ row }) => {
            const contactNumber = row.original.contactNumber;

            return contactNumber.length > 0 ? (
                <a href={`tel:${contactNumber}`} className="hover:text-blue-500 hover:underline">{contactNumber}</a>
            ) : "-"
        }
    },
    {
        accessorKey: "concerningPersonName",
        header: "Concerning Person Name",
        cell: ({ row }) => {
            const concerningPersonName = row.original.concerningPersonName;

            return concerningPersonName.length > 0 ? concerningPersonName : "-"
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy;

            return (
                <div className="flex flex-col">
                    <span>{formatDate(row.original.createdAt, "dd/MM/yyyy")}</span>
                    {createdBy && (
                        <span className="text-xs text-muted-foreground capitalize">By {createdBy}</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "blacklistedAt",
        header: "Blacklisted At",
        cell: ({ row }) => {
            const blacklistedAt = row.original.blacklistedAt;

            return blacklistedAt ? (
                <span>{formatDate(blacklistedAt, "dd/MM/yyyy")}</span>
            ) : "-"
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const isBlacklisted = row.original.blacklistedAt !== null;
            const { user } = useAuth();

            const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
            const [isBlockOpen, setIsBlockOpen] = useState(false);

            if (row.original.name === "Default") return <div className="h-8" />;

            if (user?.role !== Role.SUPER_ADMIN) return null;

            return (
                <>
                    <OrganizationBlockAlertDialog
                        isOpen={isBlockOpen}
                        setIsOpen={setIsBlockOpen}
                        organizationId={row.original.id}
                        organizationName={row.original.name}
                        isBlacklisted={isBlacklisted}
                    />

                    <OrganizationDeleteDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        organizationId={row.original.id}
                        organizationName={row.original.name}
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
                                <Link href={`organizations/${row.original.id}/edit`}>
                                    <Pencil />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
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
