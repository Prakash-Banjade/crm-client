"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Lock, MoreHorizontal, Pencil, Trash, Unlock } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TOrganization } from "@/lib/types/organization.type"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatDate } from "date-fns";
import { ResponsiveAlertDialog } from "../ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { blockOrganization } from "@/lib/actions/organization.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import OrganizationDeleteForm from "./organization-delete-form";

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
            return <Link href={`organizations/${row.original.id}`} className="hover:text-blue-500 hover:underline flex gap-4 items-center w-fit">
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

            const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false);
            const [isBlockOpen, setIsBlockOpen] = useState(false);

            const { isPending: blockPending, mutate: blockMutate } = useServerAction({
                action: blockOrganization,
                invalidateTags: [QueryKey.ORGANIZATIONS],
                onSuccess: () => {
                    setIsBlockOpen(false);
                }
            });

            const router = useRouter();

            if (row.original.name === "Default") return <div className="h-8" />;

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isBlockOpen}
                        setIsOpen={setIsBlockOpen}
                        title={isBlacklisted ? "Unblock Organization" : "Block Organization"}
                        description={`Are you sure you want to ${isBlacklisted ? "unblock" : "block"} ${row.original.name}?` + (isBlacklisted ? " Unblocking will allow the users of this organization to access the platform." : " Blocking will prevent the users of this organization from accessing the platform.")}
                        action={() => blockMutate(row.original.id)}
                        actionLabel={isBlacklisted ? "Yes, unblock" : "Yes, block"}
                        isLoading={blockPending}
                        loadingText={isBlacklisted ? "Unblocking..." : "Blocking..."}
                    />

                    <ResponsiveDialog
                        isOpen={isDeleteConfirmDialogOpen}
                        setIsOpen={setIsDeleteConfirmDialogOpen}
                        title="Remove Organization"
                        description={`Are you sure you want to remove ${row.original.name}? This action cannot be undone. This will permanently remove all the data related to this organization.`}
                    >
                        <OrganizationDeleteForm
                            setIsOpen={setIsDeleteConfirmDialogOpen}
                            organizationId={row.original.id}
                            organizationName={row.original.name}
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
                            <DropdownMenuItem onClick={() => router.push(`organizations/${row.original.id}/edit`)}>
                                <Pencil />
                                Edit
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
