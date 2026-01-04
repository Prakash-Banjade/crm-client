"use client";

import ContainerLayout from "@/components/container-layout";
import OrganizationDataTable from "@/components/organization/organization-data-table";
import { useGetBde } from "@/lib/data-access/bde-data-hooks";
import { notFound } from "next/navigation";
import { use } from "react";

type Props = {
    params: Promise<{
        id: string;
    }>;
}

export default function Page({ params }: Props) {
    const { id } = use(params);

    const { data: bde, isLoading } = useGetBde({
        id,
    })

    if (isLoading) return <div>Loading...</div>

    if (!bde) notFound();

    return (
        <ContainerLayout
            title={`Organizations by ${bde.account.firstName + " " + bde.account.lastName}`}
            description={`Email: ${bde.account.email} | Phone Number: ${bde.phoneNumber}`}
        >
            <OrganizationDataTable createdById={bde.account.id} />
        </ContainerLayout>
    )
}