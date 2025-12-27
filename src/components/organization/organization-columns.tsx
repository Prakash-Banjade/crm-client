"use client";

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { TOrganization } from "@/lib/types/organization.type"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { formatDate } from "date-fns";
import { ResponsiveAlertDialog } from "../ui/responsive-alert-dialog";
import { useServerAction } from "@/hooks/use-server-action";
import { deleteOrganization } from "@/lib/actions/organization.action";
import { QueryKey } from "@/lib/react-query/queryKeys";

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
        accessorKey: "blackListedAt",
        header: "Blacklisted At",
        cell: ({ row }) => {
            const blackListedAt = row.original.blackListedAt;

            return blackListedAt ? (
                <span>{formatDate(blackListedAt, "dd/MM/yyyy")}</span>
            ) : "-"
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const { isPending, mutate } = useServerAction({
                action: deleteOrganization,
                invalidateTags: [QueryKey.ORGANIZATIONS],
                onSuccess: () => {
                    setIsDeleteOpen(false);
                }
            });

            const router = useRouter();

            if (row.original.name === "Default") return <div className="h-8" />;

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Remove Organization"
                        description={`Are you sure you want to remove ${row.original.name}? This action cannot be undone. This will also remove all the data related to this organization.`}
                        action={() => mutate(row.original.id)}
                        actionLabel="Yes, remove"
                        isLoading={isPending}
                        loadingText="Removing..."
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
                            <DropdownMenuItem onClick={() => router.push(`organizations/${row.original.id}`)}>
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
