"use client";

import { DataTable } from "@/components/data-table/data-table";
import { useGetUsers } from "@/lib/data-access/users-data-hooks";
import { organizationUsersColumns } from "./organization-usres-columns";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import AdminUserForm from "./admin-user-form";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createQueryString } from "@/lib/utils";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";

type Props = {
    organizationId: string;
}

export default function OrganizationUsersDataTable({ organizationId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    return (
        <>
            <ResponsiveDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Add Admin"
                confirmOnExit={isFormDirty}
            >
                <AdminUserForm setIsOpen={setIsOpen} organizationId={organizationId} setIsFormDirty={setIsFormDirty} />
            </ResponsiveDialog>

            <div className="space-y-4">
                <header className="flex justify-between">
                    <h3 className="text-xl font-medium">
                        Users
                    </h3>
                    <Button variant={"outline"} onClick={() => setIsOpen(true)}>
                        <Plus /> Add Admin
                    </Button>
                </header>
                <UsersDataTable organizationId={organizationId} />
            </div>
        </>
    )
}

function UsersDataTable({ organizationId }: { organizationId: string }) {
    const searchParams = useSearchParams();

    const { data, isPending } = useGetUsers({
        queryString: createQueryString({
            organizationId,
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY) || "",
        }),
    });

    if (isPending) return <DataTableLoadingSkeleton />;

    return (
        <DataTable
            data={data?.data || []}
            columns={organizationUsersColumns}
            meta={data?.meta}
            filters={
                <div>
                    <SearchInput />
                </div>
            }
            show={{ viewColumn: false }}
        />
    )
}