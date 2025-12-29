"use client";

import OrganizationForm from '@/components/organization/organization-form';
import { useGetOrganizationById } from '@/lib/data-access/organization-data-hooks';
import { notFound } from 'next/navigation';
import { use } from 'react';

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default function EditOrganizationPage({ params }: Props) {
    const { id } = use(params);

    const { data: organization, isLoading } = useGetOrganizationById({ id })

    if (isLoading) return <div>Loading...</div>

    if (!organization) notFound();

    return (
        <OrganizationForm defaultValues={organization} />
    )
}