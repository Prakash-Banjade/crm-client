import { TUser } from "@/lib/types/user.type";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";

export const organizationUsersColumns: ColumnDef<TUser>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => <p> {row.original.fullName} </p>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <p> {row.original.email} </p>,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => <p> {row.original.role} </p>,
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => <p> {formatDate(row.original.createdAt, "dd/MM/yyyy")} </p>,
    },
]